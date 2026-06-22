A FINIR ET/OU VERIFIER :
tout est à reverifier, juste le format à été modifier.
{{{--------------------}}}

avec les donnee rempli par le seeder :
--------------------------------------------
---------------ROUTE PRODUCTS---------------
--------------------------------------------
route: GET  /products/
desc:   Renvoie tout les produits de la db
        publique
        Soit getallproduct
get.test: http://localhost:3000/api/products/
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
--------------------------------------------
route: GET  /products/:id
desc:   Renvoie le produit dont l'id est preciser dans la route
        publique
        Soit getproductbyid
get.test: http://localhost:3000/api/products/1
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
--------------------------------------------
route: POST  /products/
desc:   Crée un nouveau produit dans la db et le renvoie
        producteurs ; ne marche pas sans login verif token jwt
        Soit createProduct
post.test: http://localhost:3000/api/products/
    body:   T.B.A
Résultat: {
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
--------------------------------------------
route: PUT  /products/:id
desc:   Met à jour un produit de la db et le renvoie
        producteurs ; ne marche pas sans login verif token jwt et ne fonctionne que sur produits appartenus
        Soit updateProduct
put.test: http://localhost:3000/api/products/1
    body: T.B.A
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
--------------------------------------------
route: DELETE  /products/:id
desc:   Supprime un produit de la db
        producteurs ; ne marche pas sans login verif token jwt et ne fonctionne que sur produits appartenus
        Soit deleteProduct
delete.test: http://localhost:3000/api/products/1
Résultat:{
        "success": false,
        "error": "Produit non trouvé"
        }

----------------------------------------------
---------------ROUTE CATEGORIES---------------
----------------------------------------------

---------------------------------------------
---------------ROUTE PRODUCERS---------------
---------------------------------------------
route: GET  /producers/
desc:   Renvoie tout les producteurs de la db
        publique
        Soit getAllProducers
get.test: http://localhost:3000/api/producers/
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
--------------------------------------------
route: GET  /producers/:id
desc:   Renvoie tout le producteur dont l'id est preciser dans la route
        publique
        Soit getProducerById
get.test: http://localhost:3000/api/producers/1
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
--------------------------------------------
route: POST  /producers/
desc:   Crée un nouveau producteur dans la db et le renvoie
        admin ; ne marche pas sans login verif token jwt
        Soit createProducer
post.test: http://localhost:3000/api/producers/
    body: T.B.A
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
--------------------------------------------
route: PUT /producers/:id
desc:   Met à jour un producteur de la db et le renvoie
        publique ; ne marche pas sans login verif token jwt et le producteur ne peut que se modifier lui meme
        Soit updateProducer
put.test: http://localhost:3000/api/producers/2
    body: T.B.A
Résultat: {
    "id": 2,
    "user_id": 2,
    "description": "test",
    "shop_location": "test",
    "business_name": "tes",
    "producer_photo": "https://exemple.com/photo.jpg",
    "siret": 67
}
--------------------------------------------
route: DELETE /producers/:id
desc:   Met à jour un producteur de la db et le renvoie
        publique ; ne marche pas sans login verif token jwt et le producteur ne peut que se supprimer lui même
        Soit deleteProducer
delete.test: http://localhost:3000/api/producers/2
Résultat: {
    "success": false,
    "error": "Producteur non trouvé"
}
----------------------------------------
---------------ROUTE USER---------------
----------------------------------------

--------------------------------------------------
---------------ROUTE AUTHENTICATION---------------
--------------------------------------------------

---------------------------------------------
---------------ROUTE FAVORITES---------------
---------------------------------------------

------------------------------------------
---------------ROUTE ORDERS---------------
------------------------------------------

-----------------------------------------------
---------------ROUTE ORDER ITEMS---------------
-----------------------------------------------

------------------------------------------
---------------ROUTE EVENTS---------------
------------------------------------------

------------------------------------------------------
---------------ROUTE EVENT PARTICIPANTS---------------
------------------------------------------------------