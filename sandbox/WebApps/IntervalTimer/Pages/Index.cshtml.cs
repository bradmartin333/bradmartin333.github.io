using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Globalization;

namespace IntervalTimer.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private int val = 0;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            string dateTime = DateTime.Now.ToString("d", new CultureInfo("en-US"));
            ViewData["TimeStamp"] = dateTime;
        }

        public void OnPost()
        {
            ViewData["BackgroundColor"] = $"rgb({val},{val},{val})";
            val++;
        }
    }
}