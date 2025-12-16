# MySQL Connection Troubleshooting

## Common Errors and Solutions

### Error: "Connection refused" or "Cannot connect to MySQL"
**Solution:**
1. Make sure MySQL Server is running
   - Check Windows Services (search "Services" in Start menu)
   - Look for "MySQL" service and make sure it's "Running"
   - If not running, right-click → Start

2. Verify MySQL is listening on port 3306
   - Open MySQL Workbench
   - Try to connect to your local MySQL instance
   - If connection fails, MySQL is not running

### Error: "Access denied for user"
**Solution:**
1. Check your password in `application.properties`
   - Current: username=`root`, password=`ramram`
   - Make sure this matches your MySQL root password

2. Test connection in MySQL Workbench:
   - Open MySQL Workbench
   - Try connecting with username `root` and password `ramram`
   - If it fails, your password is wrong

### Error: "Unknown database 'hostel_management'"
**Solution:**
1. Create the database in MySQL Workbench:
   ```sql
   CREATE DATABASE IF NOT EXISTS hostel_management;
   ```

2. Or let Spring Boot create it (if you have permissions):
   - The `spring.jpa.hibernate.ddl-auto=update` setting should create tables
   - But the DATABASE itself must exist first

## Quick Test Steps

1. **Open MySQL Workbench**
2. **Connect to your MySQL server** (usually "Local instance MySQL")
3. **Run this SQL:**
   ```sql
   CREATE DATABASE IF NOT EXISTS hostel_management;
   USE hostel_management;
   SHOW TABLES;
   ```
4. **If the above works, your MySQL is fine**
5. **Then try starting Spring Boot again**

## Alternative: Use H2 Database (for testing only)

If MySQL keeps failing, you can temporarily use H2 (in-memory database) for testing:

1. Add to `pom.xml`:
   ```xml
   <dependency>
       <groupId>com.h2database</groupId>
       <artifactId>h2</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

2. Change `application.properties`:
   ```properties
   spring.datasource.url=jdbc:h2:mem:hostel_management
   spring.datasource.driver-class-name=org.h2.Driver
   spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
   ```

   (Comment out MySQL settings)

3. This creates a temporary database that resets on restart (data is lost)

