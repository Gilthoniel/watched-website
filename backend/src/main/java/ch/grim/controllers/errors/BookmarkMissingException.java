package ch.grim.controllers.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by Gaylor on 05.10.2016.
 * Error thrown when a bookmark doesn't exist
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Cannot find a bookmark to remove.")
public class BookmarkMissingException extends RuntimeException {}
