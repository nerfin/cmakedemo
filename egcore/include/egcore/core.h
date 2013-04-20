#ifndef __EG_CORE_H__
#define __EG_CORE_H__

#include <stddef.h>

#include "export.h"

/** @addtogroup egcore_api_public_core

Public methods of EG CORE. 

@{
*/

#ifdef __cplusplus
extern "C" {
#endif 

/**
Say something - caller must free.
@param returnthis return this if not NULL
@return something.
*/
EG_EXPORT char *eg_core_saysomething(const char *returnthis);

#ifdef __cplusplus
}
#endif 

/*! @} */

#endif /*__EG_CORE_H__*/
