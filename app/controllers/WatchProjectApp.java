package controllers;

import models.Project;
import models.User;
import models.UserProjectNotification;
import models.Watch;
import models.enumeration.EventType;
import models.enumeration.ResourceType;
import org.codehaus.jackson.node.ObjectNode;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import utils.Constants;
import utils.ErrorViews;
import utils.WatchService;

public class WatchProjectApp extends Controller {

    public static Result watch(String userName, String projectName) {
        Project project = Project.findByOwnerAndProjectName(userName, projectName);
        if(project == null) {
            return badProject(userName, projectName);
        }

        User user = UserApp.currentUser();
        if(user.isAnonymous()) {
            flash(Constants.WARNING, "user.login.alert");
            return redirect(routes.UserApp.loginForm());
        }

        WatchService.watch(project.asResource());

        return redirect(request().getHeader(Http.HeaderNames.REFERER));
    }

    public static Result unwatch(String userName, String projectName) {
        Project project = Project.findByOwnerAndProjectName(userName, projectName);
        if(project == null) {
            return badProject(userName, projectName);
        }

        User user = UserApp.currentUser();
        if(user.isAnonymous()) {
            flash(Constants.WARNING, "user.login.alert");
            return redirect(routes.UserApp.loginForm());
        }

        WatchService.unwatch(project.asResource());

        return redirect(request().getHeader(Http.HeaderNames.REFERER));
    }

    public static Result toggle(Long projectId, String notificationType) {
        EventType notiType = EventType.valueOf(notificationType);
        Project project = Project.find.byId(projectId);
        if(project == null) {
            return notFound(ErrorViews.NotFound.render("No project matches given id '" + projectId + "'"));
        }

        User user = UserApp.currentUser();

        if(!WatchService.isWatching(user, project.asResource())) {
            return badRequest(Messages.get("error.notfound.watch"));
        }

        UserProjectNotification upn = UserProjectNotification.findOne(user, project, notiType);
        if(upn == null) { // make the EventType OFF, because default is ON.
            UserProjectNotification.unwatchExplictly(user, project, notiType);
        } else {
            upn.toggle();
        }

        return ok();
    }

    private static Result badProject(String userName, String projectName) {
        return badRequest(ErrorViews.BadRequest.render("No project matches given user name '" + userName + "' and project name '" + projectName + "'"));
    }
}
