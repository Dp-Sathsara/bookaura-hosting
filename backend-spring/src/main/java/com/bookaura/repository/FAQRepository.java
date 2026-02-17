package com.bookaura.repository;

import com.bookaura.model.FAQ;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FAQRepository extends MongoRepository<FAQ, String> {
}
