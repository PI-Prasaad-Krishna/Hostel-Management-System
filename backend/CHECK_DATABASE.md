# How to Verify Data is Saved in MySQL

## Step 1: Check the Correct Database
Make sure you're checking the **`hostel_management`** database in MySQL Workbench:
1. Open MySQL Workbench
2. Connect to your MySQL server
3. In the left sidebar, expand **Schemas**
4. Find and click on **`hostel_management`**
5. Expand **Tables**
6. Right-click on **`hostels`** table
7. Select **"Select Rows - Limit 1000"**

## Step 2: Verify the Table Structure
The `hostels` table should have these columns:
- `id` (BIGINT, Primary Key, Auto Increment)
- `name` (VARCHAR(100), NOT NULL)
- `code` (VARCHAR(20), NOT NULL, UNIQUE)
- `address` (VARCHAR(255), nullable)
- `gender` (VARCHAR(10), nullable)
- `total_capacity` (INT, nullable)

## Step 3: Check Backend Logs
When you add a hostel through the frontend, check your backend terminal. You should see SQL queries like:
```
Hibernate: insert into hostels (address, code, gender, name, total_capacity) values (?, ?, ?, ?, ?)
```

If you don't see this, the data isn't being saved.

## Step 4: Common Issues

### Issue 1: Data appears in frontend but not in database
**Possible causes:**
- You're checking a different database
- The backend is using a different database connection
- Transaction not committed (should be fixed now with @Transactional)

### Issue 2: All fields show NULL
**Possible causes:**
- JSON field names don't match Java property names
- Frontend is sending empty/null values
- Database column names don't match entity field names

### Issue 3: Data disappears after restart
**Possible causes:**
- Using in-memory database (H2) instead of MySQL
- Database connection string is wrong
- Data is in a different database

## Step 5: Test Directly in MySQL
Try inserting data directly in MySQL Workbench:
```sql
USE hostel_management;

INSERT INTO hostels (name, code, address, gender, total_capacity) 
VALUES ('Test Hostel', 'TEST', 'Test Address', 'MIXED', 100);

SELECT * FROM hostels;
```

If this works, the database is fine. The issue is with the Spring Boot connection.

## Step 6: Verify Backend Connection
Check your `application.properties` file:
- Database URL: `jdbc:mysql://localhost:3306/hostel_management`
- Username: `root`
- Password: `ramram`

Make sure these match your MySQL Workbench connection settings.

