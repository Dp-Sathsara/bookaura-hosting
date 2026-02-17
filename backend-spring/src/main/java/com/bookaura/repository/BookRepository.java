package com.bookaura.repository;

import com.bookaura.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByCategory(String category);

    List<Book> findByAuthorContainingIgnoreCase(String author);

    List<Book> findByTitleContainingIgnoreCase(String title);

    @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
            "{ '$group': { '_id': null, 'total': { '$sum': '$stock' } } }"
    })
    Long getTotalStock();
}
