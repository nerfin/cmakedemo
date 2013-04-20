#ifndef __EG_FN_KS_H__
#define __EG_FN_KS_H__

#include <stddef.h>

#include "export.h"

/** @addtogroup egfn_api_public_fn

Public methods of EG FN. 

@{
*/

#ifdef __cplusplus
extern "C" {
#endif 

/**
Say something - caller must free.
@param returnthis return this if not NULL (plus comment from core)
@return something (plus comment from core)
*/
EG_FN_EXPORT char *eg_fn_saysomething(const char *returnthis);

#ifdef __cplusplus
}
#endif 

/*! @} */

#endif /*__EG_FN_KS_H__*/
