package ch.grim.controllers.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by gaylo on 10/29/2016.
 * Error thrown when a request of resetting is already existing
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "There already exists a request")
public class ResetPasswordAlreadyExisting extends RuntimeException {
}
