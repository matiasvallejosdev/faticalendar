# Database Schema

## People Table

The `people` table stores user data for the FatiCalendar life visualization application.

### Schema Structure

| Column Name | Format | Type | Description |
|-------------|--------|------|-------------|
| id | bigint | number | Primary key, auto-incrementing unique identifier |
| name | text | string | User's full name |
| birth_year | integer | number | Year the user was born |
| nationality | text | string | User's nationality/country |
| healthy_food | boolean | boolean | Whether user maintains a healthy diet |
| running | boolean | boolean | Whether user exercises regularly/runs |
| alcohol | boolean | boolean | Whether user consumes alcohol |
| smoking | boolean | boolean | Whether user smokes |
| created_at | timestamp with time zone | string | Record creation timestamp |
| updated_at | timestamp with time zone | string | Last record update timestamp |

### Usage

This table is used to store user lifestyle data that feeds into life expectancy calculations for the calendar visualization. The lifestyle factors (healthy_food, running, alcohol, smoking) are used to adjust life expectancy estimates based on health research data.