import axios from 'axios';
import { runCompetitorSelectionWorkflow } from './workflow';
import { REFERENCE_PRODUCT } from './mockData';
import xray from '@xray/sdk';

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

async function main() {
  console.log('🚀 Starting Competitor Selection Workflow...\n');
  console.log(`Reference Product: ${REFERENCE_PRODUCT.title}`);
  console.log(`Price: $${REFERENCE_PRODUCT.price}, Rating: ${REFERENCE_PRODUCT.rating}★, Reviews: ${REFERENCE_PRODUCT.reviews}\n`);

  try {
    // Run the workflow
    const { selected, execution } = await runCompetitorSelectionWorkflow(REFERENCE_PRODUCT);

    console.log('\n✅ Workflow completed successfully!');
    console.log(`\nSelected Competitor:`);
    console.log(`  Title: ${selected.title}`);
    console.log(`  Price: $${selected.price}`);
    console.log(`  Rating: ${selected.rating}★`);
    console.log(`  Reviews: ${selected.reviews}`);

    if (!execution) {
      console.error('\n❌ No execution data found');
      return;
    }

    // Send execution to backend
    console.log('\n📤 Sending execution data to backend...');
    try {
      await axios.post(`${API_BASE}/api/executions`, execution);
      console.log(`✅ Execution stored successfully!`);
      console.log(`\n📊 View in dashboard: http://localhost:3000/executions/${execution.id}`);
    } catch (error: any) {
      console.error('❌ Failed to store execution:', error.message);
      console.log('\n💾 Execution data (JSON):');
      console.log(JSON.stringify(execution, null, 2));
    }
  } catch (error: any) {
    console.error('\n❌ Workflow failed:', error.message);
    process.exit(1);
  }
}

// Run the demo
main();

