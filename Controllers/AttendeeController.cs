using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CalendarApp.Controllers
{
    public class AttendeeController : Controller
    {

        // GET: Attendee
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAttendee(string search)
        {
            CalendarDBEntities dbAttendee = new CalendarDBEntities();
            var dataList = dbAttendee.UserViews.ToList();
            if (true)
            {
                dataList = dbAttendee.UserViews.Where(x => x.FullName.Contains(search)).ToList();
            }
            var allsearch = dataList.Select(x => new
            {
                id = x.UserId,
                text = x.FullName
            });
            return Json(allsearch, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveAttendee(Attendee dat)
        {
 
            using (CalendarDBEntities db = new CalendarDBEntities())
            {
                dat.ToString().Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Distinct();
                dat.UserId = string.Join("\n", dat.UserId);
                if (dat.AttendeeId == 0)
                {
                    db.Attendees.Add(dat);
                    db.SaveChanges();
                    return Json(new { success = true, message = "Saved Successfully", JsonRequestBehavior.AllowGet });
                }
                else
                {
                    db.Entry(dat).State = EntityState.Modified;
                    db.SaveChanges();
                    return Json(new { success = true, message = "Updated Successfully", JsonRequestBehavior.AllowGet });
                }
            }
        }
    }

}
