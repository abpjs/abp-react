#!/usr/bin/env node

/**
 * @abpjs/schematics CLI
 *
 * Code generation tool for ABP React applications.
 * Generates typed proxy services, React Query hooks, models, and enums
 * from a running ABP backend.
 *
 * Usage:
 *   abpjs proxy-add [module] --source <url> --target <path> --root-namespace <ns>
 *   abpjs proxy-refresh --source <url> --target <path> --root-namespace <ns>
 *   abpjs proxy-remove <module> --target <path>
 */

import { Command } from 'commander';
import { proxyAdd } from './commands/proxy-add';
import { proxyRefresh } from './commands/proxy-refresh';
import { proxyRemove } from './commands/proxy-remove';

const program = new Command();

program
  .name('abpjs')
  .description('ABP React code generation CLI - generates typed proxy services and React Query hooks')
  .version('3.2.0');

program
  .command('proxy-add')
  .description('Generate proxy services for a backend module')
  .argument('[module]', 'Backend module name', 'app')
  .requiredOption('--source <url>', 'Backend API URL (e.g. https://localhost:44300)')
  .requiredOption('--target <path>', 'Output directory for generated files')
  .requiredOption('--root-namespace <namespace>', 'Solution root namespace (e.g. MyCompany.MyProduct)')
  .option('--api-name <name>', 'Backend API name / remote service name', 'default')
  .action(async (module: string, opts: Record<string, string>) => {
    try {
      await proxyAdd({
        module,
        source: opts.source,
        target: opts.target,
        rootNamespace: opts.rootNamespace,
        apiName: opts.apiName,
      });
    } catch (err) {
      console.error('Error:', err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('proxy-refresh')
  .description('Re-fetch API definition and regenerate all previously generated modules')
  .requiredOption('--source <url>', 'Backend API URL (e.g. https://localhost:44300)')
  .requiredOption('--target <path>', 'Output directory for generated files')
  .requiredOption('--root-namespace <namespace>', 'Solution root namespace (e.g. MyCompany.MyProduct)')
  .option('--api-name <name>', 'Backend API name / remote service name', 'default')
  .action(async (opts: Record<string, string>) => {
    try {
      await proxyRefresh({
        source: opts.source,
        target: opts.target,
        rootNamespace: opts.rootNamespace,
        apiName: opts.apiName,
      });
    } catch (err) {
      console.error('Error:', err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('proxy-remove')
  .description('Remove a generated proxy module')
  .argument('<module>', 'Module name to remove')
  .requiredOption('--target <path>', 'Output directory containing generated files')
  .option('--source <url>', 'Backend API URL (needed to regenerate remaining modules)')
  .option('--root-namespace <namespace>', 'Solution root namespace')
  .action(async (module: string, opts: Record<string, string>) => {
    try {
      await proxyRemove({
        module,
        target: opts.target,
        source: opts.source,
        rootNamespace: opts.rootNamespace,
      });
    } catch (err) {
      console.error('Error:', err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program.parse();
