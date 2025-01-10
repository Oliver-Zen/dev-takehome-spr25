# Back-End 🍑

## Summary of My Work

I have meet minimum, main, and "above and beyond" requirements.

- Minimum Requirements
    - Use `mongoose` to define the model schema
    - Connect to local mongoDB database to setup
    - Implement `PUT /api/request`
    - Implement `GET /api/request?page=_`
- Main Requirements
    - Implement `GET /api/request?status=_`
    - Implement `PATCH /api/request`
- Above and Beyond
    - Implement `/api/requests/edit` for batch editting
    - HTTP request body example:
        ```
        {
          "updates": [
            { "id": "request1_id", "status": "approved" },
            { "id": "request2_id", "status": "completed" }
          ]
        }
        ```
    - Implement `/api/requests` for batch deleting
    - HTTP request body example:
        ```
        {
          "deletions": ["request3_id", "request4_id"]
        }

### Start the Server

- Create local mongoDB database as `mongodb://localhost:27017/crisis-corner`
- Create a `Request` collection in it
- Run `npm run start:dev` to start the server

### Future Work Could be Done 

- Use `dotenv` to manage environment variables
- Divide `server.ts` into `server.ts` and `app.ts` for better readability
- Create middleware(s) to handle input validation and so on
- Unit tests for each APIs

## Necessary Information

This is the information the non-profit has given you about what they want to store:

- `ID`: a unique identifier (required)
- `Requestor Name`: the name of the person who has requested the item (required, between 3-30 characters)
- `Item Requested`: the item that has been requested (required, between 2-100 characters)
- `Created Date`: the date that the item request has been created (required)
- `Last Edited Date`: the date that the item request was last edited (optional)
- `Status`: pending/completed/approved/rejected (required)

Make sure you are returning appropriate HTTP status codes in your responses from the API endpoints. Check out `src/lib/types/apiResponse.ts` for descriptions of status codes.

## Minimum Requirements

### Setup

1. Set up an appropriately-named MongoDB database and connect it to the application.

2. Add a `requests` collection in your database where all item requests will be stored and make sure only data that meets the needed schema can be added to the collection.

### Basic API Endpoints

3. Create `PUT /api/request` which takes in a body in the following format:

```
{
    requestorName: "Jane Doe",
    itemRequested: "Flashlights"
}
```

and adds a new item request to the database. The creation date and last edited date should be set to the current date and the status should be set to `pending`.

4. Create `GET /api/request?page=_` which returns all the item requests in the database in descending order of date created. The data should be paginated- use the `PAGINATION_PAGE_SIZE` constant. If page number is not specified, it should default to one.

## Main Requirements

5. Enable a status query parameter like `GET /api/request?status=pending` which returns all the items with that status sorted by descending date. Pagination should also work with this feature.

6. Create a `PATCH /api/request` that takes in a body of the following format:

```
{
    id: ________,
    status: approved
}
```

and updates the status of the request with the given id. Remember to also modify the last edited date of the request.

## Above and Beyond

7. Enable batch edits and batch deletes of data. Use your own discretion on the way the API endpoint/body is structured but make sure to document the endpoints in `notes.md`.
