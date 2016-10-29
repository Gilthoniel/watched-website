package ch.grim.repositories;

import ch.grim.models.ResetPassword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Created by gaylo on 10/29/2016.
 * Repository of reset password objects
 */
public interface ResetPasswordRepository extends JpaRepository<ResetPassword, Long> {

    Optional<ResetPassword> findByAccountId(long id);

    Optional<ResetPassword> findByResetId(String resetId);
}
