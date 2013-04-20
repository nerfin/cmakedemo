#ifndef __EG_EXPORTS_H__
#define __EG_EXPORTS_H__

#ifdef __cplusplus
extern "C" {
#endif 

#if !defined(EG_EXPORT)
#  if !defined(_WIN32)
#    define EG_EXPORT
#  else
#    if defined(EG_INBUILD)
#      if !defined(EG_STATIC)
#        define EG_EXPORT __declspec(dllexport)
#      else
#        define EG_EXPORT extern
#      endif
#    else // in the client
#      if !defined(EG_STATIC)
#        define EG_EXPORT __declspec(dllimport)
#      else
#        define EG_EXPORT
#      endif
#    endif
#  endif
#endif

#if !defined(EG_EXPORT_VAR)
#  if !defined(_WIN32)
#    define EG_EXPORT_VAR extern
#  else
#    if defined(EG_INBUILD)
#      if !defined(EG_STATIC)
#        define EG_EXPORT_VAR __declspec(dllexport) extern
#      else
#        define EG_EXPORT_VAR extern
#      endif
#    else // in the client
#      if !defined(EG_STATIC)
#        define EG_EXPORT_VAR __declspec(dllimport) extern
#      else
#        define EG_EXPORT_VAR extern
#      endif
#    endif
#  endif
#endif

#ifdef __cplusplus
}
#endif 

#endif /*__EG_EXPORTS_H__*/
