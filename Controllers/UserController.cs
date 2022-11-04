using CalendarApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CalendarApp.Controllers
{
    public class UserController : Controller
    {

        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SelectAttendees()
        {
            return View();
        }

        public ActionResult GetData()
        {
            using (CalendarDBEntities db = new CalendarDBEntities())
            {
                List<User> userList = db.Users.ToList<User>();
                return Json(new { data = userList },JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult SaveUpdate(int id = 0)
        {
            if (id == 0)
                return View(new User());
            else
            {
                using (CalendarDBEntities db = new CalendarDBEntities())
                {
                    return View(db.Users.Where(x => x.UserId == id).FirstOrDefault<User>());
                }
            }
        }

        [HttpPost]
        public ActionResult SaveUpdate(User us)
        {
            using (CalendarDBEntities db = new CalendarDBEntities())
            {
                if (us.UserId == 0)
                {
                    db.Users.Add(us);
                    db.SaveChanges();
                    return Json(new { success = true, message = "Saved Successfully", JsonRequestBehavior.AllowGet });
                }
                else
                {
                    db.Entry(us).State = EntityState.Modified;
                    db.SaveChanges();
                    return Json(new { success = true, message = "Updated Successfully", JsonRequestBehavior.AllowGet });
                }
            }

        }

        [HttpPost]
        public ActionResult Delete(int id)
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
