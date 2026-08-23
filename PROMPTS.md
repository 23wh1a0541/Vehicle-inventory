# PROMPTS.md

This file will contain the raw, unedited AI prompts used while building this project, as required by the assignment.

Help me start this project from scratch. Set up the backend with FastAPI and SQLite and create a clean structure for the API, database models, authentication and tests. Keep the structure simple and explain the important decisions.

Now start with registration. Write the test first and then implement the registration API. I want the password stored securely and the API should handle duplicate users properly.

The registration test is failing with the error Check my current code and find the root cause. Don't change the test just to make it pass.

Registration is working now. Build the login API with JWT authentication and connect it with the existing user model.

Build the vehicle CRUD APIs now. I need create, list, search, update and delete, and I want the existing authentication to be reused rather than creating another authentication mechanism.

The vehicle search works for one filter but gives incorrect results when I combine make, category and price. check the screenshot and Find what is wrong with the query logic and fix it.

Build the purchase and restock functionality. Purchase should decrease stock and should never allow the quantity to become negative. Restock should increase the quantity.

I found a case where purchasing a vehicle with quantity 0 is still being accepted. Check the implementation and add the correct business rule and test for it.

Some tests pass when I run them separately, but when I run the complete test suite they interfere with each other. Find out whether the database/session/test fixtures are causing this and fix the underlying problem.

Now build the React frontend with login, registration, vehicle listing, search and purchase functionality. Connect it to the APIs we already built instead of mocking the backend.

The frontend is showing this error:
OPTIONS /api/auth/register HTTP/1.1 400 Bad Request
Check the browser request and backend CORS configuration and fix the actual cause.

Login works from the frontend, but I can't see the admin controls. Check the role returned by the backend, how it is stored after login, and how the React component decides what to render.

I don't want admin security to depend only on hiding buttons in React. Check the backend as well and make sure a normal user cannot call the admin endpoints directly.

The admin view is working now, but I want to verify the customer flow separately. Check that customers can purchase and search vehicles but cannot access add, update, delete or restock.

Add realistic vehicle data to the database so the dashboard doesn't look like it contains placeholder data. Use actual vehicle models with sensible demo prices and stock quantities.

Add frontend tests for the important interactions. Start with login/register switching, admin controls and the disabled purchase button when stock is zero.

Run all backend and frontend tests now. If something fails, show me which part is actually broken and fix it without weakening the test.

Review the current implementation like a developer doing a code review. Look for duplicated logic, unnecessary complexity, weak validation, security issues and anything that could cause problems in a real application.

Check the Git changes and help me split the work into meaningful commits instead of putting the whole project into one commit. Keep the commit messages related to the actual changes.

Do one final pass through the project. Check that the application works from login to vehicle purchase/admin operations and that the tests, README, screenshots and other project files are ready.