const fs =  require('fs');


// ------------------Begin of Reusable functions ---------------------

var fetchCustomers = () => {
    try {                          //if file won't exist
        var CustomersString = fs.readFileSync('Customer-data.json')
        return JSON.parse(CustomersString);
    } catch(e){
        return [];
    }
};

var saveCustomers = (customers) => {
    fs.writeFileSync('Customer-data.json',JSON.stringify(customers));
};


// ------------------End of Reusable functions ---------------------


//  to add a new customer

var addCustomer = (customer_name,customer_email,customer_id) => {
    var customers = fetchCustomers();
    var customer = {customer_name,customer_email,customer_id}

    var duplicateCustomers =  customers.filter((customer) => { // to check if note already exists
        return customer.customer_name === customer_name;
    });

    if (duplicateCustomers.length === 0){
        customers.push(customer);
        saveCustomers(customers);
        return customer
    }

};


//to list all the customers

var getAll = () => {
    return fetchCustomers();
};


// to read a customer

var getCustomer = (customer_name) => {

    var customers = fetchCustomers();

    var getCustomers =  customers.filter((customer) => {  // to check if note exists and return note
        return customer.customer_name === customer_name;
    });

    return getCustomers[0]

};


// to delete a note

var remove = (customer_name) => {

    var customers = fetchCustomers(); // reusable func

    var filteredCustomers =  customers.filter((customer) => { // will return all other notes other than "note to be removed"
        return customer.customer_name !== customer_name;
    });

    saveCustomers(filteredCustomers); //save new notes array

    return customers.length !== filteredCustomers.length

};

// function just to print out note to screen

var logCustomer = (customer) => {
    console.log('--');
    console.log(`Customer Name: ${customer.customer_name}`);
    console.log(`Customer Email: ${customer.customer_email}`);
    console.log(`Customer ID: ${customer.customer_id}`);
};

// add new function names here to be accessible from other modules

module.exports = {
    addCustomer, getAll, remove, getCustomer,logCustomer
};
