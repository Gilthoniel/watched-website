package ch.grim.mail;

import ch.grim.models.Account;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.springframework.ui.velocity.VelocityEngineUtils;

import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Gaylor on 10/1/2016.
 * Send email to a client
 */
@Service
public class MailManager {

    private final JavaMailSender sender;
    private final VelocityEngine engine;

    @Autowired
    public MailManager(JavaMailSender sender, VelocityEngine engine) {
        this.sender = sender;
        this.engine = engine;
    }

    public void sendConfirmationMail(Account account, String token) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper msg = new MimeMessageHelper(mimeMessage);
                msg.setTo(account.getEmail());
                msg.setFrom("registration@grimsoft.ch");
                msg.setSubject("Grimsoft Watched Registration");

                Map<String,String> model = new HashMap<>();
                model.put("token", token);
                String text = VelocityEngineUtils.mergeTemplateIntoString(
                        engine, "mails/emailConfirmationEmail.vm", "UTF-8", model);
                msg.setText(text, true);
            }
        };

        sender.send(preparator);
    }
}
