export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  xpReward: number;
  hints?: string[];
}

export const fullStackChallenges: Challenge[] = [
  {
    id: "fs-1",
    title: "Login Form",
    description: "Create a login form with email input, password input, and a submit button. Style it with a centered card layout.",
    difficulty: "Beginner",
    xpReward: 20,
    hints: ["Use semantic HTML form elements", "Add placeholder text to inputs"],
  },
  {
    id: "fs-2",
    title: "Navigation Bar",
    description: "Build a responsive navbar with a logo on the left, navigation links in the center, and a CTA button on the right.",
    difficulty: "Beginner",
    xpReward: 25,
    hints: ["Use flexbox for layout", "Add hover effects to links"],
  },
  {
    id: "fs-3",
    title: "Product Card",
    description: "Create a product card with an image placeholder, title, price, rating stars, and an 'Add to Cart' button.",
    difficulty: "Intermediate",
    xpReward: 35,
    hints: ["Use CSS grid or flexbox", "Add a subtle shadow and hover animation"],
  },
  {
    id: "fs-4",
    title: "Dashboard Layout",
    description: "Build a dashboard layout with a sidebar, top header bar, and a main content area with stat cards in a grid.",
    difficulty: "Advanced",
    xpReward: 50,
    hints: ["Use CSS Grid for the overall layout", "Make the sidebar fixed position"],
  },
];

export const sqlChallenges: Challenge[] = [
  {
    id: "sql-1",
    title: "Find Top Customers",
    description: "Write a SQL query to find the top 5 customers by total order amount from the 'orders' table. Columns: customer_name, order_amount, order_date.",
    difficulty: "Beginner",
    xpReward: 20,
    hints: ["Use ORDER BY with DESC", "Use LIMIT 5"],
  },
  {
    id: "sql-2",
    title: "Employee Salary Stats",
    description: "Find the department with the highest average salary from the 'employees' table. Columns: name, department, salary.",
    difficulty: "Intermediate",
    xpReward: 30,
    hints: ["Use GROUP BY department", "Use AVG() function"],
  },
  {
    id: "sql-3",
    title: "Join Orders & Products",
    description: "Write a query to show each order with its product name. Join 'orders' (columns: id, product_id, quantity) with 'products' (columns: id, name, price).",
    difficulty: "Intermediate",
    xpReward: 35,
    hints: ["Use INNER JOIN", "Match on product_id = products.id"],
  },
];

export const cyberChallenges: Challenge[] = [
  {
    id: "cyber-1",
    title: "SQL Injection Vulnerability",
    description: "Review the following code and identify the SQL injection vulnerability. Fix it using parameterized queries.\n\n```javascript\nconst query = `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;\ndb.execute(query);\n```",
    difficulty: "Beginner",
    xpReward: 25,
    hints: ["Never concatenate user input into SQL", "Use prepared statements"],
  },
  {
    id: "cyber-2",
    title: "XSS Attack Prevention",
    description: "Find and fix the XSS vulnerability in this code:\n\n```javascript\napp.get('/search', (req, res) => {\n  const query = req.query.q;\n  res.send(`<h1>Results for: ${query}</h1>`);\n});\n```",
    difficulty: "Beginner",
    xpReward: 25,
    hints: ["Sanitize user input before rendering", "Use HTML encoding"],
  },
  {
    id: "cyber-3",
    title: "Insecure Authentication",
    description: "Review this authentication code and identify all security issues:\n\n```javascript\napp.post('/login', (req, res) => {\n  const { user, pass } = req.body;\n  const stored = db.getUser(user);\n  if (stored.password === pass) {\n    res.cookie('auth', user);\n    res.send('Welcome!');\n  }\n});\n```",
    difficulty: "Intermediate",
    xpReward: 35,
    hints: ["Passwords should be hashed", "Cookies need security flags", "Use constant-time comparison"],
  },
];

export const pythonChallenges: Challenge[] = [
  {
    id: "py-1",
    title: "NumPy Array Operations",
    description: "Write Python code using NumPy to create a 5x5 matrix of random integers (1-100), then find the row with the highest sum and print that row along with its sum.",
    difficulty: "Beginner",
    xpReward: 20,
    hints: ["Use np.random.randint()", "Use np.sum() with axis parameter"],
  },
  {
    id: "py-2",
    title: "Pandas Data Cleaning",
    description: "Given a DataFrame with columns ['name', 'age', 'salary', 'department'], write code to: 1) Remove rows where age is negative, 2) Fill missing salary values with the department median, 3) Remove duplicate names keeping the last entry.",
    difficulty: "Intermediate",
    xpReward: 30,
    hints: ["Use df.groupby().transform('median')", "Use df.drop_duplicates(subset='name', keep='last')"],
  },
  {
    id: "py-3",
    title: "Matplotlib Visualization",
    description: "Write Python code to create a figure with 2 subplots: 1) A bar chart showing monthly sales data, 2) A line chart showing the cumulative sales. Use sample data for 12 months. Add titles, labels, and a legend.",
    difficulty: "Intermediate",
    xpReward: 35,
    hints: ["Use plt.subplots(1, 2)", "Use np.cumsum() for cumulative"],
  },
  {
    id: "py-4",
    title: "Linear Regression from Scratch",
    description: "Implement a simple linear regression using only NumPy (no sklearn). Your code should: 1) Generate sample data with noise, 2) Implement gradient descent to find best-fit line, 3) Print the final coefficients and MSE.",
    difficulty: "Advanced",
    xpReward: 45,
    hints: ["Use the gradient descent formula for slope and intercept", "MSE = mean((y_pred - y_actual)^2)"],
  },
];

export const dataAnalystChallenges: Challenge[] = [
  {
    id: "da-1",
    title: "Sales Trend Analysis",
    description: "You have a dataset of monthly sales for 3 product categories (Electronics, Clothing, Food) over 12 months. Describe your analysis approach: What chart type would you use? What trends would you look for? How would you identify the best-performing category?",
    difficulty: "Beginner",
    xpReward: 20,
    hints: ["Line charts are great for trends over time", "Compare totals and growth rates"],
  },
  {
    id: "da-2",
    title: "Customer Segmentation",
    description: "A retail company has customer data with: purchase_frequency, avg_order_value, total_spent, days_since_last_purchase. Describe how you'd segment these customers into groups. What metrics and visualization would you use?",
    difficulty: "Intermediate",
    xpReward: 30,
    hints: ["Consider RFM analysis (Recency, Frequency, Monetary)", "Scatter plots can reveal clusters"],
  },
  {
    id: "da-3",
    title: "A/B Test Interpretation",
    description: "An A/B test ran for 2 weeks: Control group (1000 users, 45 conversions), Test group (1000 users, 62 conversions). Calculate the conversion rates, determine if the difference is significant, and recommend whether to implement the change. Show your reasoning.",
    difficulty: "Advanced",
    xpReward: 40,
    hints: ["Calculate conversion rate = conversions/total", "Consider statistical significance and p-value"],
  },
];

export function getRandomChallenge(list: Challenge[]): Challenge {
  return list[Math.floor(Math.random() * list.length)];
}

export function evaluateCode(code: string, challenge: Challenge): { score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;

  if (code.trim().length < 10) {
    return { score: 0, feedback: ["Your submission is too short. Please write more code."] };
  }

  // Basic heuristic scoring
  score += 30; // Base for attempting
  feedback.push("✓ Code submitted successfully");

  if (code.length > 50) {
    score += 20;
    feedback.push("✓ Good code length");
  }

  if (code.includes("<") && code.includes(">")) {
    score += 15;
    feedback.push("✓ HTML structure detected");
  }

  if (code.includes("style") || code.includes("class") || code.includes("css")) {
    score += 15;
    feedback.push("✓ Styling applied");
  }

  if (code.includes("function") || code.includes("=>") || code.includes("const")) {
    score += 10;
    feedback.push("✓ JavaScript logic detected");
  }

  if (code.includes("flex") || code.includes("grid")) {
    score += 10;
    feedback.push("✓ Modern layout techniques used");
  }

  score = Math.min(score, 100);
  return { score, feedback };
}

export function evaluateSQL(query: string, challenge: Challenge): { score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;
  const upper = query.toUpperCase().trim();

  if (upper.length < 5) {
    return { score: 0, feedback: ["Please write a SQL query."] };
  }

  score += 20;
  feedback.push("✓ Query submitted");

  if (upper.includes("SELECT")) { score += 15; feedback.push("✓ SELECT statement found"); }
  if (upper.includes("FROM")) { score += 15; feedback.push("✓ FROM clause present"); }
  if (upper.includes("WHERE") || upper.includes("GROUP BY") || upper.includes("ORDER BY")) {
    score += 20; feedback.push("✓ Filtering/ordering applied");
  }
  if (upper.includes("JOIN")) { score += 15; feedback.push("✓ JOIN operation used"); }
  if (upper.includes("LIMIT") || upper.includes("TOP")) { score += 15; feedback.push("✓ Result limiting applied"); }

  score = Math.min(score, 100);
  return { score, feedback };
}

export function evaluateCyber(answer: string, challenge: Challenge): { score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;
  const lower = answer.toLowerCase();

  if (answer.trim().length < 10) {
    return { score: 0, feedback: ["Please provide a more detailed answer."] };
  }

  score += 25;
  feedback.push("✓ Answer submitted");

  const keywords = ["parameterized", "prepared", "sanitize", "escape", "hash", "bcrypt", "encode", "httponly", "secure", "csrf", "token", "validation"];
  const found = keywords.filter((k) => lower.includes(k));
  score += Math.min(found.length * 15, 60);
  if (found.length > 0) {
    feedback.push(`✓ Security concepts identified: ${found.join(", ")}`);
  }

  if (lower.includes("fix") || lower.includes("solution") || lower.includes("instead")) {
    score += 15;
    feedback.push("✓ Solution approach provided");
  }

  score = Math.min(score, 100);
  return { score, feedback };
}
