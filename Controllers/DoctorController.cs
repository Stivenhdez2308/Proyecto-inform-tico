using Microsoft.AspNetCore.Mvc;
using EcografiaApp.Models;
using EcografiaApp.Services;
using System.Threading.Tasks;

namespace EcografiaApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly DoctorService _doctorService;

        public DoctorController(DoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarDoctor([FromBody] Doctor doctor)
        {
            var doctorExistente = await _doctorService.GetDoctorByEmail(doctor.Email);
            if (doctorExistente != null)
            {
                return BadRequest("El email ya está registrado");
            }

            await _doctorService.CreateDoctor(doctor);
            return Ok("Doctor registrado con éxito");
        }
    }
}
