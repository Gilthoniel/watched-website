package ch.grim.repositories;

import ch.grim.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Created by Gaylor on 8/6/2016.
 *
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findById(long id);

    Optional<Account> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("update Account acc set acc.registerId = ?2 where acc.id = ?1")
    void setRegisterId(long id, String registerId);
}
