# Workflow: Retry Until All Pass

This workflow describes how Kilo Code should attempt to run code or tests repeatedly until all results pass.

## Steps

1. **Prepare the Environment**
   - Ensure all dependencies are installed.
   - Confirm the correct working directory.

2. **Run the Tests or Code**
   - Execute the relevant test or run command (e.g., `npm test` or language-specific command).

3. **Check Results**
   - Analyze the output for pass/fail status.
   - If all tests pass, proceed to completion.
   - If any test fails, continue to the next step.

4. **Fix Issues Before Retry**
   - Analyze failure output and logs.
   - Identify anything that can be fixed (e.g., code errors, missing dependencies, misconfigurations).
   - Apply fixes before retrying.

5. **Retry**
   - Re-run the tests or code after applying fixes.

6. **Repeat Steps 2-5**
   - Continue retrying, always fixing what can be fixed before each retry, until all results pass or a maximum retry limit is reached.

7. **Completion**
   - Once all tests pass, finalize the workflow.
   - Report the successful result.

## Notes

- Log each attempt and its result for traceability.
- If a maximum retry limit is set, stop and report failure after reaching the limit.
- Ensure error messages are clear and actionable.