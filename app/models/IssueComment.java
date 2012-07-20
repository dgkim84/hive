/**
 * @author Taehyun Park
 */

package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;
import utils.JodaDateUtil;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

@Entity
public class IssueComment extends Model {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    @Id
    public Long id;
    @Constraints.Required
    public String contents;
    @Constraints.Required
    public Date date;
    public String filePath;
    @ManyToOne
    public User author;
    @ManyToOne
    public Issue issue;


    public IssueComment() {
        date = JodaDateUtil.today();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public static Finder<Long, IssueComment> find = new Finder<Long, IssueComment>(
        Long.class, IssueComment.class);

    public static List<IssueComment> findCommentsByIssueId(Long issueId) {
        return find.where().eq("issue.id", issueId).findList();
    }

    public static Long create(IssueComment issueComment) {
        Issue.countUpCommentCounter(issueComment.issue);
        issueComment.save();
        return issueComment.id;
    }

    public static void deleteByIssueId(Long issueId) {
        List<IssueComment> targets = IssueComment.find.where().eq("issue.id", "" + issueId).findList();

        Iterator<IssueComment> target = targets.iterator();
        while (target.hasNext()) {
            IssueComment issueComment = target.next();
            issueComment.delete();
        }
    }
}