// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;  // Seller's address
        bool sold;
    }

    mapping(uint => Product) public products;
    uint public productCount;

    event ProductAdded(uint id, string name, uint price, address owner);
    event ProductPurchased(uint id, address buyer, uint price);

    function addProduct(string memory _name, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        productCount++;
        products[productCount] = Product(productCount, _name, _price, payable(msg.sender), false);
        emit ProductAdded(productCount, _name, _price, msg.sender);
    }

    function purchaseProduct(uint _id) public payable {
        Product storage _product = products[_id];
        require(_product.id > 0 && _product.id <= productCount, "Product does not exist");
        require(msg.value == _product.price, "Incorrect value sent");
        require(!_product.sold, "Product already sold");
        require(_product.owner != msg.sender, "Buyer cannot be the owner");

        // Transfer payment to the seller (product owner)
        _product.owner.transfer(msg.value);

        // Update product state
        _product.owner = payable(msg.sender);
        _product.sold = true;
        products[_id] = _product;

        emit ProductPurchased(_id, msg.sender, msg.value);
    }
}
