#!/usr/bin/env bun
import { Command } from "commander";
import prompts from "prompts";
import chalk from "chalk";
import fetch from "node-fetch";

const program = new Command();
const API_BASE = "http://localhost:3000/api";

program
  .name("rosetta")
  .description("CLI to discover Linux installation commands")
  .version("0.1.0");

program
  .command("search")
  .description("Search for a package")
  .argument("<query>", "package name")
  .action(async (query) => {
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      const results = (await res.json()) as any[];

      if (results.length === 0) {
        console.log(chalk.yellow("No results found."));
        return;
      }

      const choices = results
        .filter((r) => r.type === "package")
        .map((r) => ({ title: r.name, value: r.slug }));

      if (choices.length === 0) {
        console.log(chalk.yellow("No packages found matching that query."));
        return;
      }

      const response = await prompts({
        type: "select",
        name: "slug",
        message: "Select a package to view commands:",
        choices,
      });

      if (response.slug) {
        // Fetch package details from a new API or directly from DB if it were a monorepo shared lib
        // Since we are CLI, let's assume we might need a package detail API 
        // For now, let's just point to the URL
        console.log(`\nView commands at: ${chalk.cyan(`http://localhost:3000/package/${response.slug}`)}`);
      }
    } catch (error) {
      console.error(chalk.red("Error connecting to Rosetta API. Make sure the server is running."));
    }
  });

program.parse();
