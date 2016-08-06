package ch.grim.controllers.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by gaylo on 8/6/2016.
 * Throw when the account is null but should exist
 */
@ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Cannot resolve the account")
public class AccountMissingException extends RuntimeException {
}
