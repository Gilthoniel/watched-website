package ch.grim.controllers.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by gaylo on 10/29/2016.
 * Error thrown when the reset password record is expired
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "The request is expired")
public class ResetPasswordExpired extends RuntimeException {
}
