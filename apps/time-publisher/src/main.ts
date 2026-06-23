// apps/time-publisher/src/services/main.ts entry popint for time-publisher app
import { TimeService } from './services/time-service.js';

async function bootstrap() {

  try {
    // Initialize server
    await TimeService.startPublisher();
    console.log('✅ TimePublisher initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize TimePublisher:', error);
    process.exit(1); // Exit with error code if startup fails
  }

  // Register the SIGTERM handler (standard for Docker/Kubernetes shutdown)
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down...');
    try {
      await TimeService.shutdown();
      console.log('TimeService has been shut down gracefully');
    } catch (error) {
      console.error('Error during TimeService shutdown:', error);
    } finally {
      process.exit(0);
    }
  });

  // Register the SIGINT handler (standard for Ctrl+C in terminal)
  process.on('SIGINT', async () => {
    console.log
  try {
    await TimeService.shutdown();
    console.log('TimeService has been shut down gracefully');
  } catch (error) {
    console.error('Error during TimeService shutdown:', error);
  } finally {
    // Forcefully exit the process after shutdown
    process.exit(0);
  }
  }); 
   
  // end of bootstrap
   return;
}

function main() {
  console.log('🚀 Application bootstrap is starting...');
  bootstrap();
}

main();