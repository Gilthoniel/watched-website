package ch.grim.mail;

import ch.grim.models.Account;
import ch.grim.models.ResetPassword;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.springframework.ui.velocity.VelocityEngineUtils;

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
        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper msg = new MimeMessageHelper(mimeMessage);
            msg.setTo(account.getEmail());
            msg.setFrom("registration@grimsoft.ch");
            msg.setSubject("GrimSoft Watched - Registration");

            Map<String,Object> model = new HashMap<>();
            model.put("token", token);
            String text = VelocityEngineUtils.mergeTemplateIntoString(
                    engine, "mails/emailConfirmationEmail.vm", "UTF-8", model);
            msg.setText(text, true);
        };

        sender.send(preparator);
    }

    public void sendResetPasswordEmail(Account account, ResetPassword reset) {
        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper msg = new MimeMessageHelper(mimeMessage);
            msg.setTo(account.getEmail());
            msg.setFrom("registration@grimsoft.ch");
            msg.setSubject("GrimSoft Watched - Password Reset Request");

            Map<String,Object> model = new HashMap<>();
            model.put("uuid", reset.getResetId());
            String text = VelocityEngineUtils.mergeTemplateIntoString(
                    engine, "mails/emailResetPassword.vm", "UTF-8", model
            );

            msg.setText(text, true);
        };

        sender.send(preparator);
    }
}
