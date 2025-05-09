using Domain.Common;
using Domain.Errors;
using FluentValidation;

namespace Application.Common.FluentValidation;

public static class ValidationContextExtensions
{
    public static void AddError<T>(this ValidationContext<T> context, Error error)
    {
        context.AddFailure(error.Serialize());
    }
}
