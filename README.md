




<h1 align=center>
    <img width="250" src="./eskimo.png">
    </br></br>
    Eskimo - Supercharged Mocking
</h1>
<h3 align=center>


Introducing Eskimo.</br>A new mocking server for developers and testers.</br>
Eskimo aims to abstract the complexities of coding a mock server into simple JSON configurations.
</br></br>
</h3>

## Features
1. A new, easy to grasp, keyword syntax to describe API responses entirely within a JSON file, eradicating the need to write raw logic through code.
2. Built-in Primitives that help generate random data for some of the most commonly used data. eg; name, address, phone number, random string, random integer and a lot more. See [this](https://github.com/abhimanyupandian/casual) for more info.
3. Ability to add custom Primitives to generate data, specific to a variety of use-cases.

## Getting started

**Install Eskimo**  

```
npm -g install https://github.com/kappasquare/eskimo.git
```

**Start Eskimo**

```bash
eskimo --routes "~/path/to/routes.json" --primitives "~/path/to/custom_primitives.js" --port 3210
```

**NOTE** Sample routes, primitives and schema configuration files are provided [here](https://github.com/kappasquare/eskimo/tree/main/example)

## What is Eskimo for?
- Developers and Testers can quickly spin up a working API server that generates random data, almost exactly replicating the real world scenario.
- Additionally, Developers, Testers and Stakeholders can use the Eskimo Schema as a Proof of Contract. What this means is that, the Schema definition can be included as a part of the design phase of the backend API development. Once defined, the Schema becomes the source of truth of how the API is supposed to work and any deviations from that can be immedately be identified as an anomaly.

## Core concepts
Eskimo is composed of the following concepts:
1. Eskimo Keywords
2. Schema (a JSON configuration file)
3. Routes (a JSON configuration file)
4. Data types:
	- Aggregators (list/object)
	- Built-in Primitives (Refer "Embedded Generators" and "Custom Generators". Refer [this](https://github.com/abhimanyupandian/casual) for all available Built-in Primitives)
    - Custom Primitives

    The above concepts can be understood by walking through an example.

	###    Requirement:
	    
	Let's consider that the requirement to create an API GET endpoint "/api/v1/restaurant/details" for a restaurant that retrieves all the current orders in the following format:
	    
        {
            "name" : "Krusty Krab",
            "location" : "Bikini Bottom",
            "owner" : "Eugene",
            "phone" : "69-420-777",
            "orders" : [
                {
                    "customer_name": "Spongebob",
                    "item" : "cheems burger",
                    "quantity" : 1,
                    "location" : "#23, Bikini Bottom"
                },
                {
                    "customer_name": "Patrick",
                    "item" : "tuna",
                    "quantity" : 3,
                    "location" : "#9, Bikini Bottom"
                }
            ]
        }

	**Note**: The core idea of Eskimo is to generate random data, to replicate the real world scenarios more effectively. This means the number of orders in the above example, need not always be 2. As we'll see, the field can be configured to generate random number of orders.

    ## Schema

    The Schema is a JSON file that defines the structure of the entire API response and also specifies what data has to filled for each field of the response. 

    Now, let's take a look at how the Eskimo Schema looks like, to fulfil our requirement:

        {
            ":is": object",
            ":value": {
                ":key:name": {":value": "company_name"},
                ":key:location" : {":value": "address"},
                ":key:owner" : {":value": "full_name"},
                ":key:phone" : {":value": "phone"},
                ":key:orders": {
                    ":is" : "list"
                    ":max_value": 100,
                    ":min_value": 0,
                    ":value" : {
                        ":is" : ":object"
                        ":value : {
                            "customer_name": {":is" : "name"},
                            "item" : {":is": "word"}, // Could be replaced with a custom-primitive to generate our own orders. But lets use a built-in primitive for this example for simplicity.
                            "quantity" : {":is" : "random"},
                            "location" : {":is" : "address"},
                            "comments": {
                                ":is" : "comments", 
                                ":sentences": {
                                    "n": 5
                                }
                            } 
                        }
                    }
                }
            }
        }

    That's it! That takes care of the Eskimo Schema! 
    
    Now, let's understand the other core concepts of Eskimo using the above example:

	## Routes
	The Route configuration file is a JSON file that maps the API endpoints to the Schemas.
	For example, as per our requirement we need an endpoint "/api/v1/restaurant/details". Let us consider that the Schema configuration JSON is "restaurant_details_schema.json" residing at "/User/XYZ/configurations/". 
	Our Route configuration file will look like this:
	```
	{
        "/api/v1/restaurant": {
    	    "/details": "/User/XYZ/configurations/restaurant_details_schema.json"
        }
	}
	```
    Any number of routes can be mapped to schemas in a similar manner. One thing however to keep in mind is that the training and leading "/" must be provided correctly. In the above snippet, "/api/v1/restaurant" has a child "/details". This is valid and so is parent as "/api/v1/restaurant/" and child as "details". 
    However "/api/v1/restaurant/" and "/details" is invalid as it would result in an endpoint with "//" upon processing. ie; "/api/v1/restaurant//details".
	**Note:** The path to the Schema configuration file currently requires the absolute path. Relatives paths are not supported yet. Check [this](https://github.com/kappasquare/eskimo/issues/2) for more info.

	Routes are provided to Eskimo as a command line argument "--routes" like so:
	```bash
	eskimo --routes "/path/to/routes.json"
	```
	
    ## Primitives
    Primitives are simply javascript functions, that generate random data.
    In order to achieve this, Eskimo uses existing open-source library called Casual.
    
    **Note**: Currently a fork of Casual is being used. Check [this](https://github.com/abhimanyupandian/casual) for more info. 
    
    Casual uses "Embedded generators" and "Custom generators" to generate random data.
    Eskimo Primitives are nothing but these "Embedded generators" and "Custom generators".
    
    Whenever the value of ":is" is other than a "list" or an "object", Eskimo considers it as a Primitive, and first looks for it in the existing pool of Primitives - the Built-in Primitives.
    If a Built-in Primitive does not exist, Eskimo looks for the value in the custom pool of Primitives, defined by the user and registered before Eskimo is started. These are Custom Primitives. If the Primitive is not found, then a run time error is thrown ,thereby failing the API call with a 500.

	####	Registering Custom Primitives: 
   Custom Primitives is a .js file that contains an export to all the functions that the user wants Eskimo to consider as a new primitive. 

    For example, custom_primitives.js could contain:

        module.exports = {
            new: function(conditions) {return conditions.value;},
            car: function() {return random_selection_from(['AUDI', 'BENZ', 'BMW']);},
            zero: function() {return 0;},
        }


	These custom primitives can be included/registered by providing the .js file as an argument to the Eskimo server, like so : 
	
		eskimo --primitives ~/path/to/custom_primitives.js
		
	These primitives can then be used as part of the Schema like Built-in Primitives.
	
    ## Eskimo Keywords
    The Eskimo Keywords can be considered as one of the cores of Eskimo's functionality. It helps users define in the Schema, how/what data has to be generated in the API response.
    
    There are 6 keywords:
      1. **:<zero-width space>key** - Object-keyword
        
	      The ":<zero-width space>key" keyword specifies the name of the field. It is important to note that the ":<zero-width space>key" keyword requires the name of the field to be provided as the postfix, in the following format":<zero-width space>key:<desired_field_name>" eg; ":<zero-width space>key:location". 
          **Note** : Every ":<zero-width space>key" holds another JSON structure, that defines how to generate the data for that key in the API response.
          From the above example, the correct Schema definition for "location" field is ":<zero-width space>key:location" : {":value": "address"} and not ":<zero-width space>key:location" : "address". The latter is an invalid Eskimo Schema and Eskimo will be unable to process it.

      2. **:is** - Generic-keyword
        
	      This specifies what the data type the particular field/key is supposed to hold. The value of ":is" could be one of the following: list, object, a built-in primitive or a custom primitive.
        **Note**: When ":is" is a list or object, there ***must*** exist a sibling, called ":value" for ":is", that defines the structure of the list or object.

      3. **:value** - List/Object-keyword

			This describes the structure of the object or the list.
        When the value being described is a list, then the ":value" holds the Eskimo Schema of every element in the list.
        When the value being describe is an object, then the ":value" holds the Eskimo Schema of the object itself.
        Lets consider our above example. 
        The first line of the Schema says : ":is:": object". This means that, the entire response is an object. And there exists a ":value" sibling defined right after it, which then describes what the Schema of the object.
        Similarly, ":<zero-width space>key:orders" is declared to be a list (":is" : "list"), the corresponding sibling ":value", describes what each value of the `orders` list must look like. In this case, each value is going to be an object.
        

      4. **:min_length** - List-keyword

		    This signifies the minimum length of the list that will be generated in the API response.
        Note: Include 0 to signify that the list in the response can be empty.

      5. **:max_length** - List-keyword

	     This signifies the maximum length of the list that will be generated in the API response.
        Note: Provide the same value for ":min_length" and ":max_length" to signify that the API response will always have a specific length.
        Note: Only positive integers are value values for lengths.

      6. **:conditions** - specific to Primitives

	      This is the way the user sends a parameter to the Primitive.
        For instance, our above example uses one of the Built-in Primitives called "sentences" from [here](https://github.com/abhimanyupandian/casual).
        As per the function definition of "sentences", a parameter called "n" can be provided as an argument.
        This can be achieved by including the argument name-value pairs within the ":conditions" keyword like so:
				
			 {
			     ":conditions" : 
				 {
				     "n" : 50
				 }
			 }

       
			**Note**: Unlike all Eskimo keywords fields inside ":conditions", like "n", do not have a ":" prefixed. This signifies that they are directly passed as arguments to the backend javascript functions and thus, the names must match (ie; without ":") so that "sentences" takes "n" as an argument. Hence we provide "n" within ":conditions" as "n" and not ":n".

    ## Aggregators

    These are list or objects. Unlike primitives, these require a ":value" sibling to be provided that describe what the list or object should hold.	
	
### Created by
[abhimanyupandian](https://github.com/abhimanyupandian)
	
### Credits
Eskimo uses [json-server](https://github.com/typicode/json-server) and [casual](https://github.com/boo1ean/casual) in the backend.
	
### Disclaimer
Eskimo currently only supports GET requests. As of yet, there are no requirements or plans to support other methods.
