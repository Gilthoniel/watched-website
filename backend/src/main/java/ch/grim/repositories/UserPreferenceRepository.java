package ch.grim.repositories;

import ch.grim.models.UserPreference;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Gaylor on 31.07.2016.
 *
 */
@Repository
public interface UserPreferenceRepository extends CrudRepository<UserPreference, String> {

}
