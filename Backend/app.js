require("dotenv").config();
require("express-async-errors");

// importing additional security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

const bodyParser = require('body-parser');   

// connect db
const connectDB = require("./db/connect");
// authentication middleware
const authenticationMiddleware = require("./middleware/authentication");
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./middleware/logger');

// routers importing
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const subscriptionRouter = require("./routes/subscription");
const companyRouter = require("./routes/company");
const fiscalYearRouter = require('./routes/fiscalYear');
const customerRouter = require('./routes/customer');
const supplierRouter = require('./routes/supplier');
const purchaseEntryRouter = require('./routes/purchaseEntry');
const salesEntryRouter = require('./routes/salesEntry');
const dueRouter = require('./routes/dueList');
const paymentRouter = require('./routes/paymentList');
const adminCountRouter = require('./routes/Dashboard Counts/adminDashboardCounts')
const userCountRouter = require('./routes/Dashboard Counts/userDashboardCounts')
const superadminCountRouter = require('./routes/Dashboard Counts/superadminDashboardCounts')

const salesSummaryRouter = require('./routes/salesSummary');
const purchaseSummaryRouter = require('./routes/purchaseSummary');


// importing error handling middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// useful middlewares for json body
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
);

// Use logger middleware
app.use(logger);    
// app.use(bodyParser.json());  
app.use(express.json()); 
app.use(express.static("./public"));
app.use(helmet());
// app.use(cors(
//   { 
//     origin: ['http://localhost:8080' , "http://127.0.0.1:8080", "http://202.51.3.168:5001"]
//   }
// ));
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscription", authenticationMiddleware, subscriptionRouter);
app.use("/api/v1/admin", authenticationMiddleware, adminRouter);
app.use("/api/v1/user", authenticationMiddleware, userRouter);
app.use("/api/v1/company", authenticationMiddleware, companyRouter);

app.use('/api/v1/fiscalYear', authenticationMiddleware, fiscalYearRouter);
app.use('/api/v1/customer', authenticationMiddleware, customerRouter);
app.use('/api/v1/supplier', authenticationMiddleware, supplierRouter);
app.use('/api/v1/purchaseEntry', authenticationMiddleware, purchaseEntryRouter);
app.use('/api/v1/salesEntry', authenticationMiddleware, salesEntryRouter);
app.use('/api/v1/due', authenticationMiddleware, dueRouter);
app.use('/api/v1/payment', authenticationMiddleware, paymentRouter);
app.use('/api/v1/adminCount', authenticationMiddleware, adminCountRouter)
app.use('/api/v1/userCount', authenticationMiddleware, userCountRouter)
app.use('/api/v1/superadminCount', authenticationMiddleware, superadminCountRouter)

app.use('/api/v1/sales', authenticationMiddleware, salesSummaryRouter)
app.use('/api/v1/purchase', authenticationMiddleware, purchaseSummaryRouter)


app.use(errorHandlerMiddleware); // error handler
app.use(notFoundMiddleware); // route not found]

// defing the port and ready for the server to start..
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is running at ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
