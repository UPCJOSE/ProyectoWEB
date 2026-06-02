using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SastreriaAPI.JWT
{
    public class JwtTokenGenerador
    {
        private readonly IConfiguration _config;

        public JwtTokenGenerador(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(string correo)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, correo)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_config["JwtSettings:ExpiresInMinutes"]!)),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
