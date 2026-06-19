Donnee rempli par le seeder

ROUTE PRODUCTS

get.test: http://localhost:3000/api/products/
Soit getallproduct
Résultat: {
    "success": true,
    "data": [
        {
            "id": 1,
            "producer_id": 1,
            "category_id": 6,
            "product_name": "Saumon",
            "description": "Saumon frais.",
            "price": "12",
            "unit": "kg",
            "stock": 50,
            "product_photo": "https://exemple.com/photo.jpg",
            "created_at": "2026-06-10T06:26:39.396Z"
        },
        {
            "id": 2,
            "producer_id": 1,
            "category_id": 3,
            "product_name": "Carottes",
            "description": "Botte de carottes bio du jardin.",
            "price": "2.5",
            "unit": "botte",
            "stock": 30,
            "product_photo": "https://exemple.com/photo.jpg",
            "created_at": "2026-06-10T06:26:39.398Z"
        },
        {
            "id": 3,
            "producer_id": 1,
            "category_id": 2,
            "product_name": "Bourgogne Rouge",
            "description": "Bouteille de vin rouge local.",
            "price": "14",
            "unit": "bouteille",
            "stock": 20,
            "product_photo": "https://exemple.com/photo.jpg",
            "created_at": "2026-06-10T06:26:39.399Z"
        }
    ]
}

get.test: http://localhost:3000/api/products/1
Soit getproductbyid
Résultat: {
    "success": true,
    "data": {
        "id": 1,
        "producer_id": 1,
        "category_id": 6,
        "product_name": "Saumon",
        "description": "Saumon frais.",
        "price": "12",
        "unit": "kg",
        "stock": 50,
        "product_photo": "https://exemple.com/photo.jpg",
        "created_at": "2026-06-10T06:26:39.396Z"
    }
}

post.test: http://localhost:3000/api/products/
Soit createProduct, ne marche pas si pas login verif token jwt et ne marche pas si le user n’est pas admin ou producteur en plus
Résultat: le produit est créé et ajouté dans la db et laid est automatiquement auto-incrementé
{
    "success": true,
    "data": {
        "id": 4,
        "producer_id": 1,
        "category_id": 6,
        "product_name": "test",
        "description": "test",
        "price": "12",
        "unit": "kg",
        "stock": 50,
        "product_photo": "https://exemple.com/photo.jpg",
        "created_at": "2026-06-10T06:48:35.208Z"
    }
}

put.test: http://localhost:3000/api/products/1
Soit UpdateProduct, ne marche pas si pas login verif token jwt et ne marche pas si le user n’est pas admin ou producteur en plus
Résultat:
{
    "success": true,
    "data": {
        "id": 4,
        "producer_id": 1,
        "category_id": 6,
        "product_name": "test",
        "description": "tests",
        "price": "12",
        "unit": "kg",
        "stock": 50,
        "product_photo": "https://exemple.com/photo.jpg",
        "created_at": "2026-06-10T06:48:35.208Z"
    }
}

Delete.test: http://localhost:3000/api/products/1
Soit UpdateProduct, ne marche pas si pas login verif token jwt et ne marche pas si le user n’est pas admin ou producteur en plus
Résultat:{
"success": false,
"error": "Produit non trouvé"
}

ROUTE PRODUCERS

get.test: http://localhost:3000/api/producers/
Soit getallproducers
Résultat: {
    "success": true,
    "data": [
        {
        "id": 1,
        "user_id": 3,
        "shop_location": "12 rue du Marché, Chalon-sur-Saône",
        "business_name": "Marée Océane",
        "siret": null
        }
    ]
}

get.test: http://localhost:3000/api/producers/1
Soit getproducersbyid
Résultat: {
    "success": true,
    "data": [
        {
        "id": 1,
        "user_id": 3,
        "shop_location": "12 rue du Marché, Chalon-sur-Saône",
        "business_name": "Marée Océane",
        "siret": null
        }
    ]
}

post.test: http://localhost:3000/api/producers/
Soit createproducers
Résultat: {
    "success": true,
    "data": {
        "id": 4,
        "user_id": 3,
        "description": "test",
        "shop_location": "test",
        "business_name": null,
        "producer_photo": "https://exemple.com/photo.jpg",
        "siret": null
    }
}

put.test: http://localhost:3000/api/producers/2
Soit updateproducers
Résultat: {
    "id": 2,
    "user_id": 2,
    "description": "test",
    "shop_location": "test",
    "business_name": "tes",
    "producer_photo": "https://exemple.com/photo.jpg",
    "siret": 67
}

delete.test: http://localhost:3000/api/producers/2
Soit deleteproducers
Résultat: {
    "success": false,
    "error": "Producteur non trouvé"
}
