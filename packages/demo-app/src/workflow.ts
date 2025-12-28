import xray, { XRayExecution } from '@xray/sdk';
import { Product, MOCK_PRODUCTS, REFERENCE_PRODUCT } from './mockData';

/**
 * Step 1: Generate search keywords from product title and category
 */
export async function generateKeywords(product: Product): Promise<string[]> {
  xray.startStep('keyword_generation', {
    product_title: product.title,
    category: product.category,
  }, 'llm_simulation');

  // Simulate LLM keyword generation
  await new Promise(resolve => setTimeout(resolve, 100));

  const keywords = [
    'stainless steel water bottle insulated',
    'vacuum insulated bottle 32oz',
    'water bottle 32oz',
  ];

  xray.endStep(
    {
      keywords,
      model: 'gpt-4',
    },
    'Extracted key product attributes: material (stainless steel), capacity (32oz), feature (insulated)'
  );

  return keywords;
}

/**
 * Step 2: Search for candidate products
 */
export async function searchCandidates(keyword: string, limit: number = 50): Promise<Product[]> {
  xray.startStep('candidate_search', {
    keyword,
    limit,
  });

  // Simulate API search delay
  await new Promise(resolve => setTimeout(resolve, 150));

  // Mock search: return products that match the keyword (simplified matching)
  const candidates = MOCK_PRODUCTS.slice(0, limit);

  xray.endStep(
    {
      total_results: 2847,
      candidates_fetched: candidates.length,
      candidates: candidates.map(p => ({
        asin: p.asin,
        title: p.title,
        price: p.price,
        rating: p.rating,
        reviews: p.reviews,
      })),
    },
    `Fetched top ${candidates.length} results by relevance; 2847 total matches found`
  );

  return candidates;
}

/**
 * Filter criteria configuration
 */
interface FilterCriteria {
  priceMin: number;
  priceMax: number;
  minRating: number;
  minReviews: number;
}

/**
 * Get filter criteria based on reference product
 */
function getFilterCriteria(referenceProduct: Product): FilterCriteria {
  return {
    priceMin: referenceProduct.price * 0.5,
    priceMax: referenceProduct.price * 2,
    minRating: 3.8,
    minReviews: 100,
  };
}

/**
 * Evaluate a single candidate against filter criteria
 */
interface FilterResult {
  passed: boolean;
  detail: string;
}

interface FilterResults {
  price_range: FilterResult;
  min_rating: FilterResult;
  min_reviews: FilterResult;
}

function evaluateCandidate(
  candidate: Product,
  criteria: FilterCriteria
): { passed: boolean; filterResults: FilterResults } {
  const filterResults: FilterResults = {
    price_range: { passed: false, detail: '' },
    min_rating: { passed: false, detail: '' },
    min_reviews: { passed: false, detail: '' },
  };

  // Price range filter
  const pricePassed = candidate.price >= criteria.priceMin && candidate.price <= criteria.priceMax;
  filterResults.price_range = {
    passed: pricePassed,
    detail: pricePassed
      ? `$${candidate.price.toFixed(2)} is within $${criteria.priceMin.toFixed(2)}-$${criteria.priceMax.toFixed(2)}`
      : candidate.price < criteria.priceMin
      ? `$${candidate.price.toFixed(2)} is below minimum $${criteria.priceMin.toFixed(2)}`
      : `$${candidate.price.toFixed(2)} is above maximum $${criteria.priceMax.toFixed(2)}`,
  };

  // Rating filter
  const ratingPassed = candidate.rating >= criteria.minRating;
  filterResults.min_rating = {
    passed: ratingPassed,
    detail: ratingPassed
      ? `${candidate.rating} >= ${criteria.minRating}`
      : `${candidate.rating} < ${criteria.minRating} threshold`,
  };

  // Reviews filter
  const reviewsPassed = candidate.reviews >= criteria.minReviews;
  filterResults.min_reviews = {
    passed: reviewsPassed,
    detail: reviewsPassed
      ? `${candidate.reviews} >= ${criteria.minReviews} minimum`
      : `${candidate.reviews} < ${criteria.minReviews} minimum`,
  };

  const passed = pricePassed && ratingPassed && reviewsPassed;

  return { passed, filterResults };
}

/**
 * Calculate ranking score for a candidate
 */
function calculateRankingScore(
  candidate: Product,
  referenceProduct: Product
): {
  scoreBreakdown: {
    review_count_score: number;
    rating_score: number;
    price_proximity_score: number;
  };
  totalScore: number;
} {
  // Calculate individual scores
  const reviewCountScore = Math.min(candidate.reviews / 10000, 1.0);
  const ratingScore = (candidate.rating - 3.0) / 2.0; // Normalize 3.0-5.0 to 0-1
  const priceDiff = Math.abs(candidate.price - referenceProduct.price);
  const maxPriceDiff = referenceProduct.price;
  const priceProximityScore = 1.0 - Math.min(priceDiff / maxPriceDiff, 1.0);

  // Weighted scoring: review count (primary), rating (secondary), price proximity (tertiary)
  const totalScore = reviewCountScore * 0.5 + ratingScore * 0.3 + priceProximityScore * 0.2;

  return {
    scoreBreakdown: {
      review_count_score: reviewCountScore,
      rating_score: ratingScore,
      price_proximity_score: priceProximityScore,
    },
    totalScore,
  };
}

/**
 * Step 3: Apply filters and rank candidates
 */
export async function filterAndRank(
  candidates: Product[],
  referenceProduct: Product
): Promise<Product> {
  xray.startStep('apply_filters', {
    candidates_count: candidates.length,
    reference_product: {
      asin: referenceProduct.asin,
      title: referenceProduct.title,
      price: referenceProduct.price,
      rating: referenceProduct.rating,
      reviews: referenceProduct.reviews,
    },
  }, 'filter_and_rank');

  const criteria = getFilterCriteria(referenceProduct);

  interface EvaluationData {
    candidate: {
      asin: string;
      title: string;
      metrics: {
        price: number;
        rating: number;
        reviews: number;
      };
    };
    result: {
      passed: boolean;
      qualified: boolean;
    };
    details: {
      filter_results: FilterResults;
    };
  }

  // Evaluate all candidates
  const evaluations: EvaluationData[] = [];
  const qualified: Product[] = [];

  for (const candidate of candidates) {
    const { passed, filterResults } = evaluateCandidate(candidate, criteria);

    evaluations.push({
      candidate: {
        asin: candidate.asin,
        title: candidate.title,
        metrics: {
          price: candidate.price,
          rating: candidate.rating,
          reviews: candidate.reviews,
        },
      },
      result: {
        passed,
        qualified: passed,
      },
      details: {
        filter_results: filterResults,
      },
    });

    if (passed) {
      qualified.push(candidate);
    }
  }

  // Rank qualified candidates
  const ranked = qualified
    .map(candidate => ({
      candidate,
      ...calculateRankingScore(candidate, referenceProduct),
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const selected = ranked[0]?.candidate || qualified[0];

  // Add evaluations to the step before ending it
  for (const evaluation of evaluations) {
    xray.addEvaluation(evaluation.candidate, evaluation.result, evaluation.details);
  }

  xray.endStep(
    {
      total_evaluated: candidates.length,
      passed: qualified.length,
      failed: candidates.length - qualified.length,
      selected_competitor: selected
        ? {
            asin: selected.asin,
            title: selected.title,
            price: selected.price,
            rating: selected.rating,
            reviews: selected.reviews,
          }
        : null,
    },
    `Applied price, rating, and review count filters to narrow candidates from ${candidates.length} to ${qualified.length}. Selected best match based on review count, rating, and price proximity.`
  );

  return selected;
}

/**
 * Main workflow: Competitor product selection
 */
export async function runCompetitorSelectionWorkflow(
  referenceProduct: Product
): Promise<{ selected: Product; execution: XRayExecution }> {
  // Start execution
  xray.startExecution({
    workflow: 'competitor_selection',
    reference_product: referenceProduct.asin,
  });

  try {
    // Step 1: Generate keywords
    const keywords = await generateKeywords(referenceProduct);

    // Step 2: Search for candidates (use first keyword)
    const candidates = await searchCandidates(keywords[0], 50);

    // Step 3: Filter and rank
    const selected = await filterAndRank(candidates, referenceProduct);

    // End execution and get the data
    const execution = xray.endExecution();

    return { selected, execution };
  } catch (error) {
    // End execution even on error
    xray.endExecution();
    throw error;
  }
}

