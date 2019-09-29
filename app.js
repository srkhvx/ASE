const fs =  require('fs');
const yargs = require('yargs');

const customers = require('./customers.js');

// ------------ Begin - command configuration -----------------




const NameOptions = {
    describe: 'Name of Customer',
    demand : true,
    alias : 'n'
}
const EmailOptions = {
    describe: 'Email of Customer',
    demand : true,
    alias : 'e'
}
const IdOptions = {
    describe: 'ID of Customer',
    demand : true,
    alias : 'i'
}



const argv =  yargs

    .command('add','Add a new Customer',{
      name: NameOptions,
      email: EmailOptions,
      id: IdOptions
    })
    .command('list','List all Customers')
    .command('read','Read a customer',{
      name: NameOptions
    })
    .command('remove','Remove a Customer',{
      name: NameOptions
    })
    .help()
    .argv;


// ------------ End - command configuration -----------------


var command = yargs.argv._[0];


if (command === 'add'){
    var customer = customers.addCustomer(argv.name,argv.email,argv.id);
    if (customer){
      customers.logCustomer(customer);                                //add a new customer
    } else{
      console.log("Customer already exists");
    }
}

else if (command === 'list') {
  var AllCustomers = customers.getAll();
  console.log(`Printing ${AllCustomers.length} customer(s).`);
  AllCustomers.forEach((customer)=>{                                //list all customer(s)
    customers.logCustomer(customer);
  });
}

else if (command === 'read') {
   var customer = customers.getCustomer(argv.name);
   if(customer){
    customers.logCustomer(customer);                                //read a customer
          }
   else{
    console.log("Customer not found");
   }
}
else if (command === 'remove') {
    var CustomerRemoved = customers.remove(argv.name);
    var message = CustomerRemoved ? 'Customer was removed' : 'Customer not found';
    console.log(message);
}

else{
  console.log('command not recognized');
}
