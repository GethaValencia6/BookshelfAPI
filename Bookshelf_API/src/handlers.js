const { customAlphabet } = require('nanoid/async')
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)

var buku = require('./buku')

const AddBuku = async (req, res) => {

    //console.log(req.payload)
    
    let {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount,
        readPage,
        reading,
    } = req.payload

    if(req.payload.name === undefined) {
        return res.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        }).code(400)
    }

    if(readPage > pageCount) {
        return res.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400)
    }

    /*set id dkk*/
    let id = await nanoid();
    let insertedAt = new Date().toISOString()
    let updatedAt = insertedAt
    let finished = (pageCount === readPage);

    let bukuBaru = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    }

    // add buku baru
    buku.push(bukuBaru)

    //cek apakah buku masuk dengan filter
    //console.log(buku)

    let masuk = buku.filter((listBuku) => listBuku.id == id);

    if(masuk.length == 1) {
        //masuk
        return res.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId : id
            }
        }).code(201)
    }

};

const getBuku = async (req, res) => {
    

    let { 
        name, 
        reading, 
        finished 
    } = req.query;

    var resultFilter = { books: buku }

    if(req.params.id) {
        getId = req.params.id;

        filterBukuSatu = (resultFilter.books).filter((listBuku) => (listBuku.id == getId))
        
        if(filterBukuSatu.length === 0) {
            return res.response({
                status: "fail",
                message: "Buku tidak ditemukan" 
            }).code(404)
        }
        delete resultFilter.books
        resultFilter = { book: filterBukuSatu[0] }

    }

    //get params name
    (name !== undefined) ? (resultFilter['books'] = resultFilter['books'].filter((listBuku) => (listBuku.name.toLowerCase()).includes(name.toLowerCase()))) : "";

    //get params reading
    (finished !== undefined) ? (resultFilter['books'] = resultFilter['books'].filter((listBuku) => listBuku.finished === !!Number(finished))) : "";


    //reading

    (reading !== undefined && reading <= 1) ? resultFilter['books'] = resultFilter['books'].filter((listBuku) => listBuku.reading == !!Number(reading)) : "";

    let keys = Object.keys(resultFilter);

    if(keys[0] == "books") {
        resultFilter['books'] = (resultFilter['books']).map((listBuku) => ({
        
            id: listBuku.id,
            name: listBuku.name,
            publisher: listBuku.publisher
    
        })); 
    }
    


    return res.response({
        status: "success",
        data: resultFilter
    }).code(200)
};

const updateBuku = async (req, res) => {
    let bookId = req.params.id;
    
    // cari index buku
    let arrayBuku = buku.filter((listBuku) => listBuku.id === bookId);
    
    if(arrayBuku[0]) {

        let {
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount,
            readPage,
            reading,
        } = req.payload
        
        if(name === undefined) {
            return res.response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku"
            }).code(400)
        }

        if(readPage > pageCount) {
            return res.response({
                status: "fail",
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
            }).code(400)
        }

        //sat set
        let updatedAt = new Date().toISOString()
        let finished = (pageCount === readPage);

        arrayBuku[0] = {
            ...arrayBuku[0],
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        }

        let indexBuku = buku.findIndex((listBuku) => listBuku.id === bookId);
        buku[indexBuku] = arrayBuku[0]

        return res.response({
            status: "success",
            message: "Buku berhasil diperbarui"
        }).code(200)

    } else {
        return res.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404)
    }
};

const deleteBuku = async (req, res) => {
    let bookId = req.params.id;

    let arrayBuku = buku.filter((listBuku) => listBuku.id === bookId);
    
    if(arrayBuku[0]) {
        buku = buku.filter((listBuku) => listBuku.id !== bookId);
        return res.response({
            status: "success",
            message: "Buku berhasil dihapus"
        }).code(200)
    }

    return res.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan"
    }).code(404)
}

module.exports = { getBuku, AddBuku, updateBuku, deleteBuku }