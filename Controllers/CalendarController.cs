using CalendarApp.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CalendarApp.Controllers
{
    public class CalendarController : Controller
    {
        // GET: Calendar
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetEvents()
        {
            using (CalendarDBEntities calDb = new CalendarDBEntities())
            {
                var events = calDb.Events.ToList();
                return new JsonResult { Data = events, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }

        [HttpPost]
        public JsonResult SaveEvent (Event e)
        {
            var status = false;
            using (CalendarDBEntities calDb = new CalendarDBEntities())
            {
                if (e.EventID > 0)
                {
                    //Update the Event
                    var v = calDb.Events.Where(a => a.EventID == e.EventID).FirstOrDefault();
                    if (v != null)
                    {
                        v.EventTitle = e.EventTitle;
                        v.EventDescription = e.EventDescription;
                        v.StartDate = e.StartDate;
                        v.EndDate = e.EndDate;
                        v.AllDay = e.AllDay;
                        v.Recurring = e.Recurring;
                        v.Frequency = e.Frequency;
                        v.ThemeColor = e.ThemeColor;
                        
                    }
                }
                else
                {
                    calDb.Events.Add(e);
                }
                calDb.SaveChanges();
                status = true;
            }
            return new JsonResult { Data = new { status = status } };

        }


        [HttpPost]
        public ActionResult DeleteEvent(int id)
        {
            using (CalendarDBEntities db = new CalendarDBEntities())
            {
                User objUs = db.Users.Where(x => x.UserId == id).FirstOrDefault<User>();
                db.Users.Remove(objUs);
                db.SaveChanges();
                return Json(new { success = true, message = "Deleted Successfully", JsonRequestBehavior.AllowGet });
            }
        }
    }
}