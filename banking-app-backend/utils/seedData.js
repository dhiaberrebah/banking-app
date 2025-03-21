const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Account = require("../models/Account")
const Transaction = require("../models/Transaction")
const BillPayment = require("../models/BillPayment")
const Notification = require("../models/Notification")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Account.deleteMany({})
    await Transaction.deleteMany({})
    await BillPayment.deleteMany({})
    await Notification.deleteMany({})

    console.log("Previous data cleared")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      isVerified: true,
    })

    console.log("Admin user created")

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10)
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: userPassword,
      phoneNumber: "555-123-4567",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
      isVerified: true,
    })

    console.log("Regular user created")

    // Create accounts for user
    const checkingAccount = await Account.create({
      userId: user._id,
      accountNumber: "1000000001",
      accountType: "checking",
      balance: 5000,
      nickname: "Primary Checking",
    })

    const savingsAccount = await Account.create({
      userId: user._id,
      accountNumber: "1000000002",
      accountType: "savings",
      balance: 10000,
      interestRate: 0.01,
      nickname: "Emergency Savings",
    })

    const creditAccount = await Account.create({
      userId: user._id,
      accountNumber: "1000000003",
      accountType: "credit",
      balance: -500,
      creditLimit: 5000,
      availableCredit: 4500,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      minimumPayment: 25,
      nickname: "Rewards Credit Card",
    })

    console.log("Accounts created")

    // Create transactions
    const transactions = [
      {
        userId: user._id,
        fromAccount: checkingAccount._id,
        transactionType: "withdrawal",
        amount: 100,
        description: "ATM Withdrawal",
        status: "completed",
        category: "Cash",
        transactionId: "TX" + Date.now() + "0001",
      },
      {
        userId: user._id,
        toAccount: checkingAccount._id,
        transactionType: "deposit",
        amount: 1500,
        description: "Salary Deposit",
        status: "completed",
        category: "Income",
        transactionId: "TX" + Date.now() + "0002",
      },
      {
        userId: user._id,
        fromAccount: checkingAccount._id,
        toAccount: savingsAccount._id,
        transactionType: "transfer",
        amount: 500,
        description: "Savings Transfer",
        status: "completed",
        transactionId: "TX" + Date.now() + "0003",
      },
      {
        userId: user._id,
        fromAccount: creditAccount._id,
        transactionType: "payment",
        amount: 75.99,
        description: "Online Purchase",
        status: "completed",
        category: "Shopping",
        payee: "Amazon",
        transactionId: "TX" + Date.now() + "0004",
      },
      {
        userId: user._id,
        fromAccount: checkingAccount._id,
        transactionType: "payment",
        amount: 120,
        description: "Electricity Bill",
        status: "completed",
        category: "Utilities",
        payee: "Power Company",
        transactionId: "TX" + Date.now() + "0005",
      },
    ]

    await Transaction.insertMany(transactions)
    console.log("Transactions created")

    // Create bill payments
    const billPayments = [
      {
        userId: user._id,
        accountId: checkingAccount._id,
        payee: "Rent",
        amount: 1200,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        frequency: "monthly",
        category: "Housing",
        reminderEnabled: true,
      },
      {
        userId: user._id,
        accountId: checkingAccount._id,
        payee: "Internet Provider",
        amount: 89.99,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        frequency: "monthly",
        category: "Utilities",
        reminderEnabled: true,
      },
      {
        userId: user._id,
        accountId: checkingAccount._id,
        payee: "Cell Phone",
        amount: 75,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        frequency: "monthly",
        category: "Utilities",
        reminderEnabled: true,
      },
    ]

    await BillPayment.insertMany(billPayments)
    console.log("Bill payments created")

    // Create notifications
    const notifications = [
      {
        userId: user._id,
        title: "Welcome to Banking App",
        message: "Thank you for joining our banking application. Explore all the features available to you.",
        type: "info",
        isRead: false,
      },
      {
        userId: user._id,
        title: "Security Alert",
        message:
          "Your account was accessed from a new device. If this was not you, please contact support immediately.",
        type: "security",
        isRead: false,
      },
      {
        userId: user._id,
        title: "Bill Due Soon",
        message: "Your Internet Provider bill of $89.99 is due in 5 days.",
        type: "account",
        isRead: false,
      },
      {
        userId: user._id,
        title: "Low Balance Alert",
        message: "Your Credit Card account balance is below $500.",
        type: "account",
        isRead: false,
      },
    ]

    await Notification.insertMany(notifications)
    console.log("Notifications created")

    console.log("Database seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedData()

