from db_connection import get_database

db = get_database()


def insert_person(person_id, name, embedding, cover_image=None):
    """
    Inserta una nueva persona en la base de datos.
    """
    collection = db["known_faces"]
    if collection.find_one({"name": name}):
        raise ValueError(f"El nombre '{name}' ya existe en la base de datos.")
    document = {
        "id": person_id,
        "name": name,
        "embedding": {"1": embedding},  # Guardar el primer embedding con índice "1"
        "cover_image": cover_image
    }
    collection.insert_one(document)


def update_person(person_id, name=None, embedding=None, cover_image=None):
    """
    Actualiza los datos de una persona en la base de datos.
    """
    collection = db["known_faces"]
    update_fields = {}
    if name:
        if collection.find_one({"name": name, "id": {"$ne": person_id}}):
            raise ValueError(f"El nombre '{name}' ya existe en la base de datos.")
        update_fields["name"] = name
    if embedding:
        # Obtener el documento actual
        person = collection.find_one({"id": person_id})
        if not person:
            raise ValueError(f"No se encontró la persona con ID {person_id}.")

        # Obtener el índice del próximo embedding
        embedding_index = str(len(person.get("embedding", {})) + 1)

        # Agregar el nuevo embedding al objeto "embedding"
        collection.update_one(
            {"id": person_id},
            {"$set": {f"embedding.{embedding_index}": embedding}}
        )
    if cover_image:
        update_fields["cover_image"] = cover_image
    if update_fields:
        collection.update_one({"id": person_id}, {"$set": update_fields})


def delete_person(person_id):
    """
    Elimina una persona de la base de datos.
    """
    collection = db["known_faces"]
    collection.delete_one({"id": person_id})

def load_embeddings():
    """
    Carga todos los embeddings y nombres desde la base de datos.
    """
    collection = db["known_faces"]
    embeddings = []
    names = []
    for doc in collection.find():
        for key, embedding in doc.get("embedding", {}).items():
            embeddings.append(embedding)
            names.append(doc["name"])
    print(f"Se cargaron {len(names)} rostros desde la base de datos.")
    return embeddings, names

def get_all_names():
    """
    Devuelve una lista de todas las personas registradas en la base de datos.
    """
    collection = db["known_faces"]
    names = []
    for doc in collection.find({}, {"_id": 0, "id": 1, "name": 1}):
        names.append(doc)
    return names if names else []  # Asegurarse de devolver una lista vacía si no hay datos


def get_by_name(name):
    """
    Devuelve los datos de una persona por su nombre.
    """
    collection = db["known_faces"]
    return collection.find_one({"name": name}, {"_id": 0})


def get_by_id(person_id):
    """
    Devuelve los datos de una persona por su ID.
    """
    collection = db["known_faces"]
    return collection.find_one({"id": person_id}, {"_id": 0})


def get_cover_image(person_id):
    """
    Devuelve la imagen de portada de una persona por su ID.
    """
    collection = db["known_faces"]
    person = collection.find_one({"id": person_id}, {"_id": 0, "cover_image": 1})
    return person["cover_image"] if person else None