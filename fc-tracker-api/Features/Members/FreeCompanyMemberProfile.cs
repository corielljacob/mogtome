using AutoMapper;
using fc_tracker_api.Features.Members.Data;
using NetStone.Model.Parseables.FreeCompany.Members;

namespace fc_tracker_api.Features.Members
{
    public class FreeCompanyMemberProfile : Profile
    {
        public FreeCompanyMemberProfile() 
        {
            CreateMap<FreeCompanyMembersEntry, FreeCompanyMember>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));
        }
    }
}
