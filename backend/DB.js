const mysql = require("mysql");
const env = require("dotenv");
const instance = null;
env.config();

const connection = mysql.createConnection({
    host :process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port:process.env.DB_PORT,
    database:process.env.DATABASE
});

connection.connect((err)=>{
    if(err){
        console.log(err.message);
    }
    console.log("db: "+connection.state);
})

class dbService {
    static getDbServiceInstance(){
        return instance ? instance : new dbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Manga;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async insertNewName(name,chapterNo) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO Manga(Name, chapterNo) VALUES (?,?);";

                connection.query(query, [name, chapterNo] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id : insertId,
                Name : name,
                chapterNo: chapterNo
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM Manga WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Manga SET Name = ? WHERE id = ?";
    
                connection.query(query, [name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(Name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const searchString = Name;
                const query = "SELECT * FROM Manga WHERE Name like ?;";
                const escapedSearchString = '%' + searchString + '%';
                connection.query(query,escapedSearchString, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = dbService;