A FINIR ET/OU VERIFIER :
tout est à reverifier, juste le format à ete modifier.
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
Resultat: {
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
Resultat: {
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
desc:   Cree un nouveau produit dans la db et le renvoie
        producteurs ; ne marche pas sans login verif token jwt
        Soit createProduct
post.test: http://localhost:3000/api/products/
    body:   T.B.A
Resultat: {
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
Resultat:
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
Resultat:{
        "success": false,
        "error": "Produit non trouve"
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
Resultat: {
    "success": true,
    "data": [
        {
        "id": 1,
        "user_id": 3,
        "shop_location": "12 rue du Marche, Chalon-sur-Saône",
        "business_name": "Maree Oceane",
        "siret": null
        }
    ]
}
--------------------------------------------
route: GET  /producers/:id
desc:   Renvoie le producteur dont l'id est precise dans la route
        publique
        Soit getProducerById
get.test: http://localhost:3000/api/producers/1
Resultat: {
    "success": true,
    "data": [
        {
        "id": 1,
        "user_id": 3,
        "shop_location": "12 rue du Marche, Chalon-sur-Saône",
        "business_name": "Maree Oceane",
        "siret": null
        }
    ]
}
--------------------------------------------
route: POST  /producers/
desc:   Cree un nouveau producteur dans la db et le renvoie
        admin ; ne marche pas sans login verif token jwt
        Soit createProducer
post.test: http://localhost:3000/api/producers/
    body: T.B.A
Resultat: {
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
Resultat: {
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
desc:   Supprime un producteur de la db
        publique ; ne marche pas sans login verif token jwt et le producteur ne peut que se supprimer lui même
        Soit deleteProducer
delete.test: http://localhost:3000/api/producers/2
Resultat: {
    T.B.A
}
----------------------------------------
---------------ROUTE USER---------------
----------------------------------------
route: GET  /users/
desc:   Renvoie tout les utilisateurs de la db
        admin ; ne marche pas sans login verif token jwt
        Soit getAllUsers
get.test: http://localhost:3000/api/users/
Resultat: {
    T.B.A
}
--------------------------------------------
route: GET  /users/:id
desc:   Renvoie l'utilisateur dont l'id est precise dans la route
        admin ; ne marche pas sans login verif token jwt
        Soit getUserById
get.test: http://localhost:3000/api/users/1
Resultat: {
    T.B.A
}
--------------------------------------------
route: POST  /users/
desc:   Cree un nouveau utilisateur dans la db et le renvoie
        admin ; ne marche pas sans login verif token jwt
        Soit createUser
post.test: http://localhost:3000/api/users/
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: PUT /users/:id
desc:   Met à jour un utilisateur de la db et le renvoie
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que se modifier lui meme
        Soit updateUser
put.test: http://localhost:3000/api/users/2
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: DELETE /users/:id
desc:   Supprime un utilisateur de la db
        admin ; ne marche pas sans login verif token jwt
        Soit deleteUser
delete.test: http://localhost:3000/api/users/2
Resultat: {
    T.B.A
}
--------------------------------------------------
---------------ROUTE AUTHENTICATION---------------
--------------------------------------------------
T.B.A
---------------------------------------------
---------------ROUTE FAVORITES---------------
---------------------------------------------
route: GET  /favorites/
desc:   Renvoie tout les favoris de la db
        admin ; ne marche pas sans login verif token jwt
        Soit getAllFavorites
get.test: http://localhost:3000/api/favorites/
Resultat: {
    T.B.A
}
--------------------------------------------
route: GET  /favorites/:id
desc:   Renvoie le favoris dont l'id est precise dans la route
        admin ; ne marche pas sans login verif token jwt
        Soit getFavoriteById
get.test: http://localhost:3000/api/favorites/1
Resultat: {
    T.B.A
}
--------------------------------------------
route: POST  /favorites/
desc:   Cree un nouveau favoris dans la db et le renvoie
        publique ; ne marche pas sans login verif token jwt
        Soit createFavorite
post.test: http://localhost:3000/api/favorites/
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: PUT /favorites/:id
desc:   Met à jour un favoris de la db et le renvoie
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que modifier ses propres favoris
        Soit updateFavorite
put.test: http://localhost:3000/api/favorites/2
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: DELETE /favorites/:id
desc:   Supprime un favoris de la db
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que supprimer ses propres favoris
        Soit deleteFavorite
delete.test: http://localhost:3000/api/favorites/2
Resultat: {
    T.B.A
}
------------------------------------------
---------------ROUTE ORDERS---------------
------------------------------------------
route: GET  /orders/
desc:   Renvoie toute les commandes de la db
        admin ; ne marche pas sans login verif token jwt
        Soit getAllOrders
get.test: http://localhost:3000/api/orders/
Resultat: {
    T.B.A
}
--------------------------------------------
route: GET  /orders/:id
desc:   Renvoie la commande dont l'id est precise dans la route
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que voir ses propres commandes ou les commandes qu'il gere s'il est un producteur
        Soit getOrderById
get.test: http://localhost:3000/api/orders/1
Resultat: {
    T.B.A
}
--------------------------------------------
route: POST  /orders/
desc:   Cree une nouvelle commande dans la db et le renvoie
        publique ; ne marche pas sans login verif token jwt
        Soit createOrder
post.test: http://localhost:3000/api/orders/
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: PUT /orders/:id
desc:   Met à jour une commande de la db et le renvoie
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que modifier ses propres commandes et que si la commande n'est pas finaliser
        Soit updateOrder
put.test: http://localhost:3000/api/orders/2
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: DELETE /orders/:id
desc:   Supprime une commande de la db et le renvoie
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que supprimer ses propres commandes et que si la commande n'est pas finaliser
        Soit deleteOrder
delete.test: http://localhost:3000/api/orders/2
Resultat: {
    T.B.A
}
-----------------------------------------------
---------------ROUTE ORDER ITEMS---------------
-----------------------------------------------
route: GET  /orderitems/
desc:   Renvoie tout les items de toute les commandes de la db
        admin ; ne marche pas sans login verif token jwt
        Soit getAllOrderItems
get.test: http://localhost:3000/api/orderitems/
Resultat: {
    T.B.A
}
--------------------------------------------
route: GET  /orderitems/:id
desc:   Renvoie l'item dont l'id est precise dans la route
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que voir les items de ses propres commandes ou les items des commandes qu'il gere s'il est un producteur
        Soit getOrderItemById
get.test: http://localhost:3000/api/orderitems/1
Resultat: {
    T.B.A
}
--------------------------------------------
route: POST  /orderitems/
desc:   Cree une nouvelle commande dans la db et le renvoie
        publique ; ne marche pas sans login verif token jwt
        Soit createOrderItem
post.test: http://localhost:3000/api/orderitems/
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: PUT /orderitems/:id
desc:   Met à jour l'item d'une commande de la db et le renvoie
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que modifier les items de ses propres commandes et que si la commande n'est pas finaliser
        Soit updateOrderItem
put.test: http://localhost:3000/api/orderitems/2
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: DELETE /orderitems/:id
desc:   Supprime un item d'une commande de la db
        publique ; ne marche pas sans login verif token jwt et l'utilisateur ne peut que supprimer les items de ses propres commandes et que si la commande n'est pas finaliser
        Soit deleteOrderItem
delete.test: http://localhost:3000/api/orderitems/2
Resultat: {
    T.B.A
}
------------------------------------------
---------------ROUTE EVENTS---------------
------------------------------------------
route: GET  /events/
desc:   Renvoie tout les evenements de la db
        publique 
        Soit getAllEvents
get.test: http://localhost:3000/api/events/
Resultat: {
    T.B.A
}
--------------------------------------------
route: GET  /events/:id
desc:   Renvoie l'evenement dont l'id est precise dans la route
        publique 
        Soit getEventById
get.test: http://localhost:3000/api/events/1
Resultat: {
    T.B.A
}
--------------------------------------------
route: POST  /events/
desc:   Cree un nouveau evenement dans la db et le renvoie
        T.B.A 
        createEvent
post.test: http://localhost:3000/api/events/
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: PUT /events/:id
desc:   Met à jour un evenement de la db et le renvoie
        organisateur ; ne marche pas sans login verif token jwt et un organisateur ne peut que modifier son/ses propre evenement(s)
        soit UpdateEvent
put.test: http://localhost:3000/api/events/2
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: DELETE /events/:id
desc:   Supprime un evenement de la db
        admin ; ne marche pas sans login verif token jwt
        Soit deleteEvent
delete.test: http://localhost:3000/api/events/2
Resultat: {
    T.B.A
}
------------------------------------------------------
---------------ROUTE EVENT PARTICIPANTS---------------
------------------------------------------------------
route: GET  /eventparticipants/
desc:   Renvoie tout les participants de tout les evenements de la db
        admin ; ne marche pas sans login verif token jwt
        Soit getAllEventParticipants
get.test: http://localhost:3000/api/eventparticipants/
Resultat: {
    T.B.A
}
--------------------------------------------
route: GET  /eventparticipants/:id
desc:   Renvoie le participant d'evenement dont l'id est precise dans la route
        publique 
        Soit getEventParticipantById
get.test: http://localhost:3000/api/eventparticipants/1
Resultat: {
    T.B.A
}
--------------------------------------------
route: POST  /eventparticipants/
desc:   Cree un nouveau participant d'evenement dans la db et le renvoie
        T.B.A 
        createEventParticipant
post.test: http://localhost:3000/api/eventparticipants/
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: PUT /eventparticipants/:id
desc:   Met à jour un participant d'evenement de la db et le renvoie
        organisateur ; ne marche pas sans login verif token jwt 
        soit UpdateEventParticipant
put.test: http://localhost:3000/api/eventparticipants/2
    body: T.B.A
Resultat: {
    T.B.A
}
--------------------------------------------
route: DELETE /eventparticipants/:id
desc:   Supprime un participant d'evenement de la db
        organisateur ; ne marche pas sans login verif token jwt
        Soit deleteEventParticipant
delete.test: http://localhost:3000/api/eventparticipants/2
Resultat: {
    T.B.A
}