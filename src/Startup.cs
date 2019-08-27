using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using Swashbuckle.AspNetCore.Swagger;
using System.Net.Http;
using System.Security.Authentication;

namespace Microsoft.WWV
{
    public class Startup
    {
        IHostingEnvironment CurrentHostingEnvironment { get; set; }

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            CurrentHostingEnvironment = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwtoption =>
            {
                jwtoption.Authority = Configuration["AzureAd:Authority"];
                jwtoption.Audience = Configuration["AzureAd:Audience"];
                jwtoption.SaveToken = true;

                if (this.CurrentHostingEnvironment.IsDevelopment())
                {
                    jwtoption.RequireHttpsMetadata = false;
                }
                else
                {
                    jwtoption.RequireHttpsMetadata = true;
                }
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Volunteering API", Version = "v1" });
            });

            services.AddScoped<HttpClient>();
            services.AddScoped<IMongoClient>(sp =>
                new MongoClient(new MongoClientSettings() {
                    Server = new MongoServerAddress(Configuration["EventDB:ServerName"], 10255),
                    UseTls = true,
                    SslSettings = new SslSettings
                    {
                        EnabledSslProtocols = SslProtocols.Tls12
                    },
                    Credential = new MongoCredential(
                        "SCRAM-SHA-1", 
                        new MongoInternalIdentity(Configuration["EventDB:DbName"], Configuration["EventDB:UserName"]),
                        new PasswordEvidence(Configuration["EventDB:Password"])
                        )
                })
            ); 
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Volunteering API V1");
            });

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
