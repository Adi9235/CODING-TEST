
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['DEMO-DATABASE']
collection = db['DEMO-FULL-STACK-1']  # Correct collection name

# Seed the database with sample data only if it's empty
def seed_db():
    if collection.count_documents({}) == 0:
        employees = [
            {
                "EmployeeId": 1,
                "FirstName": "John",
                "LastName": "Doe",
                "Email": "john.doe@example.com",
                "Position": "Developer"
            },
            {
                "EmployeeId": 2,
                "FirstName": "Jane",
                "LastName": "Doe",
                "Email": "jane.doe@example.com",
                "Position": "Designer"
            }
        ]
        collection.insert_many(employees)

@app.route('/employees', methods=['GET'])
def get_employees():
    employees = list(collection.find({}, {'_id': 0}))
    return jsonify(employees), 200

@app.route('/employee', methods=['POST'])
def create_employee():
    employee = request.get_json()
    employee['EmployeeId'] = collection.count_documents({}) + 1  # Auto increment EmployeeId
    collection.insert_one(employee)
    return jsonify({"msg": "Employee added successfully"}), 201

@app.route('/employee/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    employee_data = request.get_json()
    collection.update_one({"EmployeeId": employee_id}, {"$set": employee_data})
    return jsonify({"msg": "Employee updated successfully"}), 200

@app.route('/employee/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    collection.delete_one({"EmployeeId": employee_id})
    return jsonify({"msg": "Employee deleted successfully"}), 200

if __name__ == '__main__':
    seed_db()
    app.run(debug=True)
