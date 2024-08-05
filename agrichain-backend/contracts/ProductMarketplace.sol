// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductMarketplace {
    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        uint quantity; // Number of remaining units
        string ipfsHash;
        address payable owner;
        bool sold;
    }

    mapping(uint => Product) public products;
    uint public productCount;

    event ProductAdded(uint id, string name, string description, uint price, uint quantity, string ipfsHash, address owner);
    event ProductPurchased(uint id, address buyer, uint price);

    function addProduct(
        string memory _name, 
        string memory _description, 
        uint _price, 
        uint _quantity, 
        string memory _ipfsHash
    ) public {
        require(_price > 0, "Price must be greater than zero");
        require(_quantity > 0, "Quantity must be greater than zero");
        productCount++;
        products[productCount] = Product(
            productCount, 
            _name, 
            _description, 
            _price, 
            _quantity, 
            _ipfsHash, 
            payable(msg.sender), // Seller address is set to the message sender
            false
        );
        emit ProductAdded(
            productCount, 
            _name, 
            _description, 
            _price, 
            _quantity, 
            _ipfsHash, 
            msg.sender
        );
    }

    function purchaseProduct(uint _id) public payable {
        Product memory _product = products[_id];
        require(_product.id > 0 && _product.id <= productCount, "Product does not exist");
        require(msg.value == _product.price, "Incorrect value sent");
        require(!_product.sold, "Product already sold");
        require(_product.owner != msg.sender, "Buyer cannot be the owner");
        require(_product.quantity > 0, "Product is out of stock");

        // Update the product's quantity
        _product.quantity--;
        if (_product.quantity == 0) {
            _product.sold = true; // Mark as sold if quantity is zero
        }
        products[_id] = _product;

        _product.owner.transfer(msg.value);
        emit ProductPurchased(_id, msg.sender, msg.value);
    }
}
