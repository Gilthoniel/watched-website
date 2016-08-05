package ch.grim.controllers;

import ch.grim.WatchedApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Gaylor on 31.07.2016.
 *
 */
@Controller
public class HomeController {

    private static final Logger LOG = LoggerFactory.getLogger(WatchedApplication.class);

    @RequestMapping("/")
    public String index() {
        return "forward:/index.html";
    }
}
