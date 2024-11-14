// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TourismPayments {
    struct Article {
        string name;
        address business;
        uint256 price;
        bool isActive;
    }

    struct ArticleInfo {
        string name;
        address business;
        uint256 price;
        bool isActive;
    }
    
    struct Booking {
        uint256 totalAmount;
        uint256 operatorFee;
        uint256 timestamp;
        address customer;
        address payer;
        bool isPaid;
        bool isCompleted;
        bool isRefunded;
        uint256 articleCount;
    }
    
    address public operator;
    uint256 public operatorFeePercentage;
    uint256 public constant DISPUTE_PERIOD = 2 days;
    uint256 public bookingCounter;
    uint256 public articleCounter;
    
    mapping(uint256 => Booking) public bookings;
    mapping(uint256 => mapping(uint256 => uint256)) public bookingArticles; // bookingId => index => articleId
    mapping(uint256 => Article) public articles;
    
    event ArticleCreated(uint256 indexed articleId, string name, address business, uint256 price);
    event ArticleUpdated(uint256 indexed articleId, string name, address business, uint256 price);
    event ArticleDeleted(uint256 indexed articleId);
    event BookingCreated(uint256 indexed bookingId, address indexed customer, uint256 totalAmount);
    event BookingPaid(uint256 indexed bookingId, uint256 amount);
    event PaymentCompleted(uint256 indexed bookingId);
    event PaymentRefunded(uint256 indexed bookingId);
    
    modifier onlyOperator() {
        // require(msg.sender == operator, "Only operator can call this function");
        _;
    }
    
    constructor(uint256 _operatorFeePercentage) {
        operator = msg.sender;
        operatorFeePercentage = _operatorFeePercentage;
    }
    
    // Input of 1000 = 1 CAM
    // Input of 100 = 0.1 CAM
    // Input of 10 = 0.01 CAM
    // Input of 1 = 0.001 CAM

    // Article Management Functions
    function createArticle(string memory _name, address _business, uint256 _price) external onlyOperator returns (uint256) {
        uint256 articleId = articleCounter++;
        articles[articleId] = Article({
            name: _name,
            business: _business,
            price: (_price * 1e18) / 1000,
            isActive: true
        });
        
        emit ArticleCreated(articleId, _name, _business, _price);
        return articleId;
    }
    
    function updateArticle(uint256 _articleId, string memory _name, address _business, uint256 _price) external onlyOperator {
        require(articles[_articleId].isActive, "Article does not exist");
        Article storage article = articles[_articleId];
        article.name = _name;
        article.business = _business;
        article.price = _price;
        
        emit ArticleUpdated(_articleId, _name, _business, _price);
    }
    
    function deleteArticle(uint256 _articleId) external onlyOperator {
        require(articles[_articleId].isActive, "Article does not exist");
        articles[_articleId].isActive = false;
        
        emit ArticleDeleted(_articleId);
    }
    
    function getArticle(uint256 _articleId) external view returns (string memory name, address business, uint256 price, bool isActive) {
        Article storage article = articles[_articleId];
        return (article.name, article.business, article.price, article.isActive);
    }
    
    function getAllArticles() external view returns (uint256[] memory, string[] memory, address[] memory, uint256[] memory, bool[] memory) {
        uint256[] memory ids = new uint256[](articleCounter);
        string[] memory names = new string[](articleCounter);
        address[] memory businesses = new address[](articleCounter);
        uint256[] memory prices = new uint256[](articleCounter);
        bool[] memory activeStatus = new bool[](articleCounter);
        
        for(uint256 i = 0; i < articleCounter; i++) {
            Article storage article = articles[i];
            ids[i] = i;
            names[i] = article.name;
            businesses[i] = article.business;
            prices[i] = article.price;
            activeStatus[i] = article.isActive;
        }
        
        return (ids, names, businesses, prices, activeStatus);
    }
    
    // Booking Management Functions
    function calculateTotalAmount(uint256[] memory _articleIds) public view returns (uint256 totalAmount, uint256 operatorFee) {
        for(uint i = 0; i < _articleIds.length; i++) {
            require(articles[_articleIds[i]].isActive, "Article does not exist");
            totalAmount += articles[_articleIds[i]].price;
        }
        operatorFee = (totalAmount * operatorFeePercentage) / 10000;
        return (totalAmount + operatorFee, operatorFee);
    }

    function createBooking(uint256[] memory _articleIds, address _customer) external returns (uint256) {
        require(_articleIds.length > 0, "No articles provided");
        require(_customer != address(0), "Invalid customer address");

        (uint256 totalAmount, uint256 operatorFee) = calculateTotalAmount(_articleIds);
        
        uint256 bookingId = bookingCounter++;
        
        bookings[bookingId] = Booking({
            totalAmount: totalAmount,
            operatorFee: operatorFee,
            timestamp: block.timestamp,
            customer: _customer,
            payer: address(0),
            isPaid: false,
            isCompleted: false,
            isRefunded: false,
            articleCount: _articleIds.length
        });
        
        // Store article references
        for(uint i = 0; i < _articleIds.length; i++) {
            bookingArticles[bookingId][i] = _articleIds[i];
        }
        
        emit BookingCreated(bookingId, _customer, totalAmount);
        return bookingId;
    }
    
    function payBooking(uint256 _bookingId) external payable {
        Booking storage booking = bookings[_bookingId];
        require(!booking.isPaid, "Booking already paid");
        require(msg.value == booking.totalAmount, "Incorrect payment amount");
        
        booking.isPaid = true;
        booking.timestamp = block.timestamp; // Reset timestamp to payment time
        booking.payer = msg.sender;
        
        emit BookingPaid(_bookingId, msg.value);
    }
    
    function getAllBookings() external view returns (
        uint256[] memory ids,
        uint256[] memory amounts,
        uint256[] memory operatorFees,
        uint256[] memory timestamps,
        address[] memory customers,
        address[] memory payers, 
        bool[] memory paidStatus,
        bool[] memory completedStatus,
        bool[] memory refundedStatus
    ) {
        ids = new uint256[](bookingCounter);
        amounts = new uint256[](bookingCounter);
        operatorFees = new uint[](bookingCounter);
        timestamps = new uint256[](bookingCounter);
        customers = new address[](bookingCounter);
        payers = new address[](bookingCounter); 
        paidStatus = new bool[](bookingCounter);
        completedStatus = new bool[](bookingCounter);
        refundedStatus = new bool[](bookingCounter);
        
        for(uint256 i = 0; i < bookingCounter; i++) {
            Booking storage booking = bookings[i];
            ids[i] = i;
            amounts[i] = booking.totalAmount;
            operatorFees[i] = booking.operatorFee;
            timestamps[i] = booking.timestamp;
            customers[i] = booking.customer;
            payers[i] = booking.payer;  
            paidStatus[i] = booking.isPaid;
            completedStatus[i] = booking.isCompleted;
            refundedStatus[i] = booking.isRefunded;
        }
    }
    
    function completePayment(uint256 _bookingId) external onlyOperator {
        Booking storage booking = bookings[_bookingId];
        require(booking.isPaid, "Booking not paid");
        require(!booking.isCompleted && !booking.isRefunded, "Booking already processed");
        
        booking.isCompleted = true;
        
        // Transfer operator fee
        payable(operator).transfer(booking.operatorFee);
        
        // Transfer payments to businesses
        for(uint i = 0; i < booking.articleCount; i++) {
            uint256 articleId = bookingArticles[_bookingId][i];
            Article storage article = articles[articleId];
            payable(article.business).transfer(article.price);
        }
        
        emit PaymentCompleted(_bookingId);
    }
    
    function refundPayment(uint256 _bookingId) external onlyOperator {
        Booking storage booking = bookings[_bookingId];
        require(booking.isPaid, "Booking not paid");
        require(!booking.isCompleted && !booking.isRefunded, "Booking already processed");
        require(block.timestamp <= booking.timestamp + DISPUTE_PERIOD, "Dispute period expired");
        
        booking.isRefunded = true;
        
        // Transfer operator fee
        payable(operator).transfer(booking.operatorFee);
        
        // Refund customer (minus operator fee)
        payable(booking.payer).transfer(booking.totalAmount - booking.operatorFee);
        
        emit PaymentRefunded(_bookingId);
    }

    function getBookingArticles(uint256 _bookingId) external view returns (ArticleInfo[] memory articleInfos) {
        Booking storage booking = bookings[_bookingId];
        articleInfos = new ArticleInfo[](booking.articleCount);
        
        for(uint256 i = 0; i < booking.articleCount; i++) {
            uint256 articleId = bookingArticles[_bookingId][i];
            Article storage article = articles[articleId];
            
            articleInfos[i] = ArticleInfo({
                name: article.name,
                business: article.business,
                price: article.price,
                isActive: article.isActive
            });
        }
        
        return articleInfos;
    }
}