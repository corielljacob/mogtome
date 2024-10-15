using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace fc_tracker_api.Features.Members
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MembersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet(Name = "SyncMembers")]
        public async Task ProcessMembers()
        {
            var command = new ProcessMembers.Command();
            await _mediator.Send(command);

        }
    }
}
